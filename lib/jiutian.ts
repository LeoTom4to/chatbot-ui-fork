// 九天API参数与通道集中配置
export const JIUTIAN = {
  URL: process.env.JIUTIAN_API_URL || 'https://jiutian.10086.cn/largemodel/api/v1/workflow/run',
  JWT: process.env.JIUTIAN_JWT_TOKEN || '', // 修正变量名
  CHAT_ID: process.env.JIUTIAN_CHATFLOW_ID || '',
  JUDGE_ID: process.env.JIUTIAN_JUDGEFLOW_ID || '',
  ANALYSIS_ID: process.env.JIUTIAN_ANALYSISFLOW_ID || '',
}; 