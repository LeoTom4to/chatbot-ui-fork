import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, mode, messages } = req.body;
  const API_KEY = process.env.JIUTIAN_API_KEY;
  const type = (req.query.type as string) || 'analyze';

  if (!API_KEY) {
    return res.status(500).json({ error: '缺少九天 API KEY' });
  }

  const baseUrl = 'https://jiutian.10086.cn/largemodel/api/v2';
  const isMulti = mode === 'multi';

  let body: any;
  let endpoint = '';
  if (type === 'explain') {
    // 解释欺诈：可用 prompt 拼接
    body = {
      model: 'jiutian-lan',
      prompt: `请详细解释以下内容中可能存在的欺诈风险及其原理：${text}`,
      temperature: 0.1,
      top_p: 0.95,
      stream: false
    };
    endpoint = 'completions';
  } else if (type === 'similar') {
    // 相似案例：可用 prompt 拼接
    body = {
      model: 'jiutian-lan',
      prompt: `请列举与以下内容相似的真实欺诈案例，并简要说明：${text}`,
      temperature: 0.1,
      top_p: 0.95,
      stream: false
    };
    endpoint = 'completions';
  } else {
    // 标准/多轮分析
    body = isMulti
      ? {
          model: 'jiutian-lan',
          messages: messages ?? [{ role: 'user', content: text }],
          temperature: 0.1,
          top_p: 0.95,
          stream: false
        }
      : {
          model: 'jiutian-lan',
          prompt: text,
          temperature: 0.1,
          top_p: 0.95,
          stream: false
        };
    endpoint = isMulti ? 'chat/completions' : 'completions';
  }

  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(500).json({ error: '调用九天接口失败', detail: errorText });
  }

  const data = await response.json();
  let content = '';
  if (type === 'explain' || type === 'similar') {
    content = data?.choices?.[0]?.text;
  } else {
    content = isMulti
      ? data?.choices?.[0]?.message?.content
      : data?.choices?.[0]?.text;
  }

  res.status(200).json({ text: content });
} 