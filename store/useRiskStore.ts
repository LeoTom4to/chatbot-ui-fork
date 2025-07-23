import { create } from 'zustand';

export type RiskStatus =
  | 'idle'              // 新建对话 / 无内容
  | 'judge_loading'     // 结构化判定流请求中
  | 'safe'              // 判定非诈骗
  | 'analysis_loading'  // 分析流请求中
  | 'scam_ready';       // 六件套已就绪

export interface FraudJudgment {
  is_scam: boolean;
  fraud_type: string;
  risk_level: string;
  confidence?: number;
  risk_tags?: string[];
  reasoning: string;
  recommendation: string;
}

export interface AnalysisData {
  fraud_judgment: FraudJudgment;
  stats?: { similar_case_ratio: number; monthly_report_count: number };
  trend?: { date: string; count: number }[];
  tips?: string[];
  authorities?: { name: string; url: string }[];
}

interface ChatRisk {
  status: RiskStatus;
  fraud: FraudJudgment | null;
  analysis: AnalysisData | null;
}

interface RiskStore {
  currentId: string | null;
  chats: Record<string, ChatRisk>;
  switchChat: (id: string) => void;
  patchChat: (id: string, partial: Partial<ChatRisk>) => void;
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  currentId: null,
  chats: {},

  switchChat: (id) =>
    set((state) => {
      if (!state.chats[id]) {
        state.chats[id] = { status: 'idle', fraud: null, analysis: null };
      }
      return { currentId: id };
    }),

  patchChat: (id, partial) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [id]: { ...state.chats[id], ...partial },
      },
    })),
})); 