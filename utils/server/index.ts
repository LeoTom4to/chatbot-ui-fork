import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import { OPENAI_API_HOST } from '../app/const';
import jwt from 'jsonwebtoken';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  key: string,
  messages: Message[],
) => {
  // 1. 生成 JWT token
  const apiKey = process.env.JIUTIAN_API_KEY || '';
  const appId = process.env.JIUTIAN_APP_ID || '';
  const [id, secret] = apiKey.split('.');
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    api_key: id,
    exp: now + 3600,
    timestamp: now,
  };
  const jwtToken = jwt.sign(payload, secret, { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT', sign_type: 'SIGN' } });

  const res = await fetch('https://jiutian.10086.cn/largemodel/api/v2/completions', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    method: 'POST',
    body: JSON.stringify({
      appId,
      model: 'jiutian-lan',
      prompt: messages[messages.length-1]?.content || '',
      history: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      temperature: 1,
      top_p: 1,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) throw new Error('API Error');

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;
          if (!data || data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            // 兼容九天大模型和 OpenAI 的流式返回字段
            const text = json.choices?.[0]?.delta?.content || json.choices?.[0]?.delta?.text;
            if (text) controller.enqueue(encoder.encode(text));
          } catch (e) {
            controller.error(e);
          }
        }
      };
      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
