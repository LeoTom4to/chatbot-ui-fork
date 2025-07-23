import React from 'react';
import { useRiskAnalysisStore } from '@/store/useRiskAnalysisStore';
import { RiskCardPanel } from './Modules';
import { AnalyzeStatus } from './Modules/AnalyzeStatus';
import { ScamIntroPanel } from './Modules/ScamIntroPanel';
import { SafeCardPanel } from './Modules/SafeCardPanel';
import { KeywordRadar } from './Modules/KeywordRadar';
import { RiskStatsPanel } from './Modules/RiskStatsPanel';
import { RiskTrendPanel } from './Modules/RiskTrendPanel';
import { FraudTipsPanel } from './Modules/FraudTipsPanel';
import { AuthorityLinksPanel } from './Modules/AuthorityLinksPanel';

export default function RiskSidebar() {
  const { analysisResult, isLoading } = useRiskAnalysisStore();
  const fraud = analysisResult?.fraud_judgment;

  return (
    <div className="fixed top-0 right-0 z-50 flex h-full w-[320px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0">
      {isLoading && <AnalyzeStatus />}
      {/* 新增：无分析结果时也展示安全提醒 */}
      {!isLoading && (!fraud || !analysisResult) && <SafeCardPanel />}
      {!isLoading && fraud && fraud.is_scam && (
        <>
          <RiskCardPanel />
          <KeywordRadar />
          <RiskStatsPanel />
          <RiskTrendPanel />
          <FraudTipsPanel />
          <AuthorityLinksPanel />
        </>
      )}
      {!isLoading && fraud && !fraud.is_scam && <SafeCardPanel />}
    </div>
  );
}
