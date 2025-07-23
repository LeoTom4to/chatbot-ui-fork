export const mockFraudJudgment = {
  is_scam: true,
  fraud_type: '冒充金融平台',
  risk_level: '高',
  confidence: 0.93,
  risk_tags: ['冒充平台', '征信威胁', '逾期催款'],
  reasoning: '短信以贷款平台名义催收逾期款项并威胁征信。',
  recommendation: '不要点击链接或转账；联系官方客服核实。'
};

export const mockAnalysis = {
  fraud_judgment: mockFraudJudgment,
  stats: { similar_case_ratio: 83, monthly_report_count: 1970 },
  trend: [
    { date: '07‑11', count: 31 },
    { date: '07‑12', count: 29 },
    { date: '07‑13', count: 40 },
    { date: '07‑14', count: 35 },
    { date: '07‑15', count: 38 },
    { date: '07‑16', count: 36 },
    { date: '07‑17', count: 42 },
  ],
  tips: [
    '不要点击短信中的任何链接',
    '核实欠款应通过官方 App',
    '遇到恐吓信息可报警并保留证据'
  ],
  authorities: [
    { name: '国家反诈中心', url: 'https://www.12377.cn/' },
    { name: '公安部官网', url: 'https://www.mps.gov.cn/' },
  ],
}; 