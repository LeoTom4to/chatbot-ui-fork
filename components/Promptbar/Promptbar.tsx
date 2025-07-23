import React, { useRef, useEffect, useState } from 'react';
import { useRiskAnalysisStore } from '@/store/useRiskAnalysisStore';
import { SafeCardPanel } from './modules/SafeCardPanel';
import { RiskCardPanel } from './modules/RiskCardPanel';
import { KeywordRadar } from './modules/KeywordRadar';
import { RiskStatsPanel } from './modules/RiskStatsPanel';
import { RiskTrendPanel } from './modules/RiskTrendPanel';
import { FraudTipsPanel } from './modules/FraudTipsPanel';
import { AuthorityLinksPanel } from './modules/AuthorityLinksPanel';
import { SAFE_FALLBACK } from '@/ui/constants/safeFallback';

// 六件套模块
const SixPieces: React.FC<{ data: any }> = ({ data }) => (
  <>
    <RiskCardPanel result={data} />
    <KeywordRadar result={data} />
    <RiskStatsPanel result={data} />
    <RiskTrendPanel result={data} />
    <FraudTipsPanel result={data} />
    <AuthorityLinksPanel result={data} />
  </>
);

export const Promptbar = () => {
  const status = useRiskAnalysisStore(s => s.status);
  const analysis = useRiskAnalysisStore(s => s.analysisResult);
  const [lastChecked, setLastChecked] = useState(() => new Date());
  const prevStatus = useRef(status);

  useEffect(() => {
    // 仅当从 judge_loading/analysis_loading 切换到 safe 时，更新时间
    if ((prevStatus.current === 'judge_loading' || prevStatus.current === 'analysis_loading') && status === 'safe') {
      setLastChecked(new Date());
    }
    prevStatus.current = status;
  }, [status]);

  if (status === 'idle' || status === 'safe') {
    return (
      <aside className="fixed right-0 top-0 h-full w-[320px] bg-[#121212] p-2 overflow-y-auto z-50">
        <SafeCardPanel lastChecked={lastChecked} />
      </aside>
    );
  }

  if (status === 'judge_loading' || status === 'analysis_loading') {
    return (
      <aside className="fixed right-0 top-0 h-full w-[320px] bg-[#121212] p-2 overflow-y-auto z-50">
        <progress className="w-full h-[2px] bg-blue-500 mb-2" />
        <div className="space-y-3 animate-pulse p-4">
          <div className="h-24 rounded bg-neutral-700/60" />
          <div className="h-32 rounded bg-neutral-700/60" />
          <div className="h-20 rounded bg-neutral-700/60" />
          <div className="mt-4 text-center text-gray-400 text-base font-bold">AI 正在分析，请稍候…</div>
        </div>
      </aside>
    );
  }

  if (status === 'scam_ready' && analysis) {
    return (
      <aside className="fixed right-0 top-0 h-full w-[320px] bg-[#121212] p-2 overflow-y-auto z-50">
        <SixPieces data={analysis} />
      </aside>
    );
  }

  // fallback
  return null;
}; 