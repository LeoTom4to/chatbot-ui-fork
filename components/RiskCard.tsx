import { FC } from 'react';

type RiskLevel = 'high' | 'medium' | 'low';

interface Props {
  level: RiskLevel;          // high | medium | low
  tags: string[];            // ['Fake Bank', 'Money Scam']
  advice: string;            // “请勿转账…”
}

const levelColor: Record<RiskLevel, string> = {
  high:   'bg-danger',
  medium: 'bg-warn',
  low:    'bg-safe',
};

export const RiskCard: FC<Props> = ({ level, tags, advice }) => {
  // 标签安全处理
  const safeTags = Array.isArray(tags) ? tags : [];
  return (
    <div className="rounded-lg border border-line bg-card p-4 shadow-inner">
      {/* 等级条 */}
      <div className={`mb-3 h-[6px] w-full rounded ${levelColor[level]}`} />

      <div className="mb-3 text-xl font-semibold capitalize text-text">
        {level === 'high' ? '高风险'
          : level === 'medium' ? '中风险'
          : '低风险'}
      </div>

      {/* 标签 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {safeTags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-danger/15 px-2 py-0.5 text-xs text-danger font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 建议说明 */}
      <p className="text-sm text-sub">{advice}</p>
    </div>
  );
}; 