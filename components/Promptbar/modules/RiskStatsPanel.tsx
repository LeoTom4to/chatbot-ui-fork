import React, { FC } from 'react';
import { SidebarCard } from './SidebarCard';

export const RiskStatsPanel: FC<{ result: any }> = ({ result }) => {
  const ratio = result.stats?.similar_case_ratio ?? 0;
  const count = result.stats?.monthly_report_count ?? 0;

  return (
    <SidebarCard>
      <h3 className="font-bold text-base mb-2 text-warn">风险统计</h3>
      <div className="flex justify-between text-warn">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{ratio}%</span>
          <span className="text-xs text-gray-300">近期同类诈骗占比</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{count.toLocaleString()}</span>
          <span className="text-xs text-gray-300">本月相关举报</span>
        </div>
      </div>
    </SidebarCard>
  );
}; 