import { create } from 'zustand';
import { useRef } from 'react';

export interface FraudJudgment {
  判断: '是诈骗' | '不是诈骗';
  类型: string;
  风险等级: string;
  可信度: string; // 百分比字符串，如 "95%"
  判断依据: string;
  类似诈骗短信: string[];
  risk_tags?: string[];
  is_scam?: boolean;
  fraud_type?: string;
  risk_level?: string;
  reasoning?: string;
  confidence?: string; // 新增：置信度
  similar_cases?: string[]; // 新增：类似诈骗短信
  recommendation?: string; // 新增：建议
}

export interface AnalysisResult {
  fraud_judgment: FraudJudgment | null;
  stats?: any;
  tips?: any[];
  authorities?: any[];
}

type RiskStatus =
  | 'idle'              // 首次进入
  | 'judge_loading'     // 判定流请求中
  | 'safe'              // 判定为非诈骗
  | 'analysis_loading'  // 流程 3 请求中
  | 'scam_ready';       // 六件套全部就绪

interface RiskAnalysisState {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  showExamples: boolean;
  status: RiskStatus;
  setAnalysisResult: (res: AnalysisResult | null) => void;
  setLoading: (v: boolean) => void;
  toggleExamples: () => void;
  setAllResult: (res: Partial<AnalysisResult>) => void;
  setStatus: (s: RiskStatus) => void;
}

export const useRiskAnalysisStore = create<RiskAnalysisState>((set) => ({
  analysisResult: null,
  isLoading: false,
  showExamples: false,
  status: 'idle',
  setAnalysisResult: (res) => set({ analysisResult: res }),
  setLoading: (v) => set({ isLoading: v }),
  toggleExamples: () => set((s) => ({ showExamples: !s.showExamples })),
  setAllResult: (res) => set((s) => {
    let mapped = {};
    if (res.fraud_judgment) {
      const fj = res.fraud_judgment;
      mapped = {
        判断: fj.is_scam === true ? '是诈骗' : '不是诈骗',
        类型: fj.fraud_type || '-',
        风险等级: fj.risk_level || '-',
        可信度: fj?.confidence || '-',
        判断依据: fj.reasoning || '-',
        类似诈骗短信: fj?.similar_cases || [],
        risk_tags: fj.risk_tags || [],
        建议: fj?.recommendation || '-',
      };
    }
    return {
      analysisResult: {
        ...s.analysisResult,
        ...res,
        ...(Object.keys(mapped).length > 0 ? mapped : {}),
        fraud_judgment: res.fraud_judgment !== undefined ? res.fraud_judgment : s.analysisResult?.fraud_judgment ?? null
      }
    };
  }),
  setStatus: (s) => set({ status: s }),
}));

export const useRiskPipeline = () => {
  const { setAllResult, setLoading, setStatus } = useRiskAnalysisStore.getState();
  const runIdRef = useRef(0);

  const sendForCheck = async (text: string) => {
    const runId = Date.now();
    runIdRef.current = runId;
    setStatus('judge_loading');
    setLoading(true);
    // 不清空 analysisResult
    try {
      // 判定流
      const judgeRes = await fetch('/api/jiutian/structured-judgment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const { fraud_judgment } = await judgeRes.json();
      if (runIdRef.current !== runId) return;
      if (!fraud_judgment?.is_scam) {
        setAllResult({ fraud_judgment });
        setStatus('safe');
        setLoading(false);
        setAllResult({}); // 只有此时才真正清空
        return;
      }
      setAllResult({ fraud_judgment });
      setStatus('analysis_loading');
      setLoading(true);
      // 分析流
      const analysisRes = await fetch('/api/jiutian/chatflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fraud_type: fraud_judgment.fraud_type,
          risk_level: fraud_judgment.risk_level,
        }),
      });
      const analysis = await analysisRes.json();
      if (runIdRef.current !== runId) return;
      setAllResult({ ...analysis, fraud_judgment });
      setStatus('scam_ready');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setStatus('idle');
    }
  };
  return { sendForCheck };
}; 