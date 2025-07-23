import React, { FC } from 'react';
import { SidebarCard } from './SidebarCard';

export const FraudTipsPanel: FC<{ result: any }> = ({ result }) => {
  const tips = result.tips ?? [];
  if (!tips.length) return null;

  return (
    <SidebarCard>
      <h3 className="font-bold text-base mb-2 text-pink-400">防骗Tips</h3>
      <ul className="list-disc pl-5 space-y-1">
        {tips.map((t: string) => <li key={t} className="text-gray-200">{t}</li>)}
      </ul>
    </SidebarCard>
  );
}; 