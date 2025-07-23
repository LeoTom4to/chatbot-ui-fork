import { FC } from 'react';
import { useState } from 'react';
import { ScamIntroPanel } from './RiskPanel/ScamIntroPanel';

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
      <ScamIntroPanel />
    </div>
  );
};

export type RiskResult = {
  判断: string;
  类型: string;
  风险等级: string;
  可信度: string;
  判断依据: string;
  类似诈骗短信: string[];
};

export const RiskCardPanel = ({ result }: { result: RiskResult }) => {
  const [expand, setExpand] = useState(false);

  if (!result?.判断) return null;

  return (
    <div className="bg-[#2d2f33] text-white rounded-xl p-4 shadow border border-white/10 w-full text-sm space-y-2 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400">⚠️</span>
        <div className="font-bold">
          {result.判断} · {result.类型}
        </div>
      </div>

      <div className="text-xs text-gray-300">
        风险等级：{result.风险等级}　可信度：{result.可信度}
      </div>

      <div className="text-xs line-clamp-2 text-gray-200">
        原因：{result.判断依据}
      </div>

      {result.类似诈骗短信?.length > 0 && (
        <div>
          <button
            className="text-blue-400 text-xs hover:underline"
            onClick={() => setExpand(!expand)}
          >
            {expand ? '收起类似案例 ▲' : '查看类似案例 ▼'}
          </button>

          {expand && (
            <ul className="mt-1 text-xs list-disc list-inside text-gray-400 space-y-1 max-h-[100px] overflow-y-auto">
              {result.类似诈骗短信.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}; 