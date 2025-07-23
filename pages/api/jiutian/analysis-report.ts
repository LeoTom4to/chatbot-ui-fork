import type { NextApiRequest, NextApiResponse } from 'next';
import { JIUTIAN } from '@/lib/jiutian';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { fraud_type, risk_level } = req.body ?? {};
  if (!fraud_type || !risk_level)
    return res.status(400).json({ error: 'Missing fraud_type or risk_level' });

  const up = await fetch(JIUTIAN.URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JIUTIAN.JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: JIUTIAN.ANALYSIS_ID,
      type: 1,
      input: { analysis_json: analysisStr },
    }),
  });

  const raw = await jiutianRes.text();
  try {
    const outer = JSON.parse(raw);
    if (outer.code === 1003) return res.status(401).json({ error: 'JWT_EXPIRED' });
    const inner = JSON.parse(outer.data?.output ?? '{}');
    return res.status(200).json(inner);
  } catch {
    return res.status(502).json({ error: 'PARSE_FAIL', raw });
  }
} 