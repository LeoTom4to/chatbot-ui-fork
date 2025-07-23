import type { NextApiRequest, NextApiResponse } from 'next';
import { JIUTIAN } from '@/lib/jiutian';
import { USE_MOCK, MOCK_DELAY } from '@/lib/config';
import { mockFraudJudgment } from '@/mocks/fraudCase.sample';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return res.status(200).json({ fraud_judgment: mockFraudJudgment });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { text } = req.body ?? {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Invalid text' });

  // 日志：收到前端请求
  console.log('收到前端请求:', text);

  try {
    // 1. input 字段修正为 BOT_USER_INPUT
    const payload = {
      id: JIUTIAN.JUDGE_ID,
      type: 1,
      input: { BOT_USER_INPUT: text }, // ✅ 唯一字段
    };
    const up = await fetch(JIUTIAN.URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JIUTIAN.JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await up.text();
    console.log('🔴 raw =', raw.slice(0, 500));
    console.log('九天API原始响应:', raw);

    let outer: any;
    try {
      outer = JSON.parse(raw);
    } catch (e) {
      return res.status(502).json({ error: 'INVALID_JSON', detail: String(e) });
    }
    if (outer.code === 1003) return res.status(401).json({ error: 'JWT_EXPIRED' });

    // 2. output 反序列化
    let result: any = {};
    if (typeof outer.data?.output === 'string') {
      try {
        result = JSON.parse(outer.data.output);
        // 修复：如果 structured_judgment 还是字符串，再 parse 一次
        if (typeof result.structured_judgment === 'string') {
          result = JSON.parse(result.structured_judgment);
        }
        // 字段兼容：potential_threat_level → risk_level
        if (result.potential_threat_level && !result.risk_level) {
          result.risk_level = result.potential_threat_level;
        }
        // risk_level 英文转中文
        if (result.risk_level) {
          if (result.risk_level === 'High') result.risk_level = '高';
          else if (result.risk_level === 'Medium') result.risk_level = '中';
          else if (result.risk_level === 'Low') result.risk_level = '低';
        }
      } catch (e) {
        result = {};
      }
    } else if (typeof outer.data?.output === 'object' && outer.data?.output !== null) {
      result = outer.data.output;
    }
    if (typeof result !== 'object' || result === null) result = {};

    // 3. 包一层 fraud_judgment
    return res.status(200).json({ fraud_judgment: result });
  } catch (e) {
    console.error('API route异常:', e);
    return res.status(502).json({ error: 'PARSE_FAIL', detail: String(e) });
  }
} 