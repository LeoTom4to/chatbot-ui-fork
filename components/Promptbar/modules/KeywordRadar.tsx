import React, { FC } from 'react';
import { SidebarCard } from './SidebarCard';

export const KeywordRadar: FC<{ result: any }> = ({ result }) => {
  const tags = result.keywords ?? result.risk_tags ?? [];
  if (!tags.length) return null;

  return (
    <SidebarCard>
      <h3 className="font-bold text-base mb-2 text-blue-300">关键词雷达</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((t: string) => (
          <span key={t}
            className="px-2 py-1 rounded bg-[#0b2547] text-blue-200 text-xs hover:scale-105 transition">
            {t}
          </span>
        ))}
      </div>
    </SidebarCard>
  );
}; 