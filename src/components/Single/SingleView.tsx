import { useCaseStore } from '@/store/useCaseStore';
import { RiskCard } from '@/components/RiskCard';
import { ChatInput } from '@/components/Chat/ChatInput';
import { QuickActions } from '@/components/QuickActions';
import { useEffect, useState } from 'react';

export const SingleView = () => {
  const currentId = useCaseStore(s => s.currentId);
  const cases = useCaseStore(s => s.cases);
  const current = cases.find(c => c.id === currentId);
  if (!current) return <div className="p-6 text-neutral-400">请选择或新建案件</div>;
  const result = (current as any).result;
  const locked = (current as any).locked;

  return (
    <section className="flex flex-col gap-6 p-6">
      {result && (
        <RiskCard level={result.risk} tags={result.tags} advice={result.advice} />
      )}
      <ChatInput />
      <QuickActions />
    </section>
  );
}; 