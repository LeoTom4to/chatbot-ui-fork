import type { NextApiRequest, NextApiResponse } from 'next';
import { JIUTIAN } from '@/lib/jiutian';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { input, history = [] } = req.body ?? {};
  if (!input || typeof input !== 'string')
    return res.status(400).json({ error: 'Invalid input' });

  const payload = {
    id: JIUTIAN.CHAT_ID,
    type: 1,
    input: {
      BOT_USER_INPUT: input,
      BOT_CHAT_HISTORY: Array.isArray(history) && history.length ? history : null,
      BOT_USER_FILE: null,
    },
  } as const;

  const upstream = await fetch(JIUTIAN.URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JIUTIAN.JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await upstream.text();
  try {
    const outer = JSON.parse(raw);
    const step1 = outer.data?.output ?? outer.output ?? null;
    if (!step1)
      return res.status(502).json({ error: 'NO_STEP1', raw });

    console.log('① step1 =', JSON.stringify(step1).slice(0, 120));

    const inner =
      typeof step1 === 'string' ? JSON.parse(step1) : step1;
    if (typeof inner === 'string') {
      console.log('② inner is string:', inner.slice(0, 120));
      return res.status(200).json({ output: inner });
    } else {
      console.log('② inner =', inner);
    }

    const text =
      inner.output ?? inner.plain_text ?? inner.text ?? inner.reply ?? '';

    console.log('③ chosen text =', text.slice(0, 120));

    if (!text) return res.status(500).json({ error: 'NO_TEXT', debug: inner });

    return res.status(200).json(
      inner && inner.fraud_judgment
        ? { output: text, fraud_judgment: inner.fraud_judgment }
        : { output: text },
    );
  } catch (e) {
    return res.status(502).json({ error: 'PARSE_FAIL', detail: String(e), raw });
  }
}
