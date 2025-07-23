export interface AnalysisData {
  is_scam?: boolean;
  判断?: string;
  类型?: string;
  风险等级?: string;
  可信度?: string;
  判断依据?: string;
  类似诈骗短信?: string[];
  // 兼容后端英文字段
  fraud_type?: string;
  risk_level?: string;
  reasoning?: string;
  // 其它 Flow3 返回字段可补充
  recommendation?: string;
  建议?: string;
} 