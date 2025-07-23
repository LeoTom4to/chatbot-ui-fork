import { useRiskStore } from '@/store/useRiskStore';
import { SixPieces } from './SixPieces';
import { SkeletonBundle } from './SkeletonBundle';
import { SafeCardPanel } from '../Promptbar/modules/SafeCardPanel';
import { RiskCardPanel } from '../Promptbar/modules/RiskCardPanel';
import { KeywordRadar } from '../Promptbar/modules/KeywordRadar';
import { SAFE_FALLBACK } from '@/ui/constants/safeFallback';
import clsx from 'clsx';

export const Promptbar = () => {
  const { currentId, chats } = useRiskStore();
  if (!currentId) return null;

  const chatRisk = chats[currentId];
  const { status, fraud, analysis } = chatRisk;

  return (
    <aside
      key={currentId}
      className={clsx(
        'fixed top-0 right-0 h-full w-[320px] overflow-y-auto bg-[#121212] p-2 transition-opacity duration-150',
        status === 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      {/* 顶部细 loading 条 */}
      {(status === 'judge_loading' || status === 'analysis_loading') && (
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-transparent animate-[progress_1.2s_linear_infinite]" />
      )}

      {/* 主内容区 */}
      {status === 'safe' && <SafeCardPanel data={SAFE_FALLBACK} />}

      {status === 'judge_loading' && (
        fraud ? (
          <>
            <RiskCardPanel result={fraud} />
            <KeywordRadar  result={fraud} />
          </>
        ) : (
          <SafeCardPanel data={SAFE_FALLBACK} />
        )
      )}

      {status === 'analysis_loading' && (
        <>
          {fraud && <RiskCardPanel result={fraud} />}
          <SkeletonBundle />
        </>
      )}

      {status === 'scam_ready' && analysis && <SixPieces data={analysis} />}
    </aside>
  );
}; 