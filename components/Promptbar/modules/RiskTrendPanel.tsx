import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import { SidebarCard } from './SidebarCard';
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });

export const RiskTrendPanel: FC<{ result: any }> = ({ result }) => {
  const data = result.trend ?? [];
  if (!data.length) return null;

  return (
    <SidebarCard>
      <h3 className="font-bold text-base mb-2 text-warn">风险趋势</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <Line type="monotone" dataKey="count" stroke="currentColor" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </SidebarCard>
  );
}; 