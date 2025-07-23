import type { NextApiRequest, NextApiResponse } from 'next';
import { USE_MOCK, MOCK_DELAY } from '@/lib/config';
import { mockAnalysis } from '@/mocks/fraudCase.sample';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return res.status(200).json(mockAnalysis);
  }

  // 假设你已拿到九天API的原始输出 rawOutput
  let rawOutput: any = {};
  try {
    // 这里应为真实九天API请求逻辑，假设已拿到 rawOutput
    // rawOutput = await fetchJiutian(...)
    rawOutput = req.body && req.body._mock_jiutian_output ? req.body._mock_jiutian_output : {};
  } catch (e) {
    // 兜底
    return res.status(200).json(mockAnalysis);
  }

  // 解析 fraud_judgment
  let fraud_judgment = rawOutput.fraud_judgment || rawOutput;
  // 如果没有 fraud_judgment 字段但有 is_scam 等，包一层
  if (!fraud_judgment.is_scam && rawOutput.is_scam !== undefined) {
    fraud_judgment = { ...rawOutput };
  }

  // 兜底补齐六件套
  const result = {
    fraud_judgment,
    stats: rawOutput.stats || mockAnalysis.stats,
    trend: rawOutput.trend || mockAnalysis.trend,
    tips: rawOutput.tips || mockAnalysis.tips,
    authorities: rawOutput.authorities || mockAnalysis.authorities,
  };
  return res.status(200).json(result);
} 