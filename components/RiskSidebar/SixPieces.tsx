import {
  RiskCardPanel,
  KeywordRadar,
  RiskStatsPanel,
  RiskTrendPanel,
  FraudTipsPanel,
  AuthorityLinksPanel,
} from '../Promptbar/modules';
import type { AnalysisData } from '@/store/useRiskStore';

export const SixPieces = ({ data }: { data: AnalysisData }) => (
  <>
    <RiskCardPanel     result={data.fraud_judgment} />
    <KeywordRadar      result={data.fraud_judgment} />
    <RiskStatsPanel    result={data} />
    <RiskTrendPanel    result={data} />
    <FraudTipsPanel    result={data} />
    <AuthorityLinksPanel result={data} />
  </>
); 