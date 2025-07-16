import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const config = { runtime: 'nodejs' };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { model = 'jiutian-lan', messages = [], prompt = '' } = req.body;

  const API_KEY = process.env.JIUTIAN_API_KEY;
  const APP_ID = process.env.JIUTIAN_APP_ID;
  if (!API_KEY || !APP_ID) {
    return res.status(400).json({ error: '缺少 appId 或 apiKey' });
  }

  // 生成 JWT
  const [kid, secret] = API_KEY.split('.');
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    api_key: kid,
    exp: now + 3600,
    timestamp: now,
    sign_type: 'SIGN',
  };
  const jwtToken = jwt.sign(payload, secret, { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT' } });

  const upstream = await fetch('https://jiutian.10086.cn/largemodel/api/v2/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      top_p: 0.9,
      appId: APP_ID,
    }),
  });

  if (!upstream.body) return res.status(500).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let isDone = false;

  while (!isDone) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        res.write(line + '\n');
        try {
          const json = JSON.parse(line.replace('data:', '').trim());
          const delta = json?.choices?.[0]?.delta;
          if (delta?.status === 'finish') {
            isDone = true;
            res.end();
            break;
          }
        } catch {
          // skip invalid line
        }
      }
    }
  }
}
