import type { AnalysisData } from '@/types/analysis';

export const SAFE_FALLBACK: AnalysisData & {
  title: string;
  subtitle: string;
  tips: string[];
} = {
  title: '暂未发现明显诈骗风险',
  subtitle: '我们将为您提供客观、智能的判断。如有进一步疑虑，请继续咨询。',
  tips: [
    '不要轻易点击短信中的任何链接或二维码',
    '陌生号码要求转账、验证码 → 一律再三核实',
    '下载官方 App / 拨打官方客服电话是最安全的验证方式',
  ],
}; 