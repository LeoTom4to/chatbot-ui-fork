import { useCaseStore } from '@/store/useCaseStore';
import { MessageList } from '@/components/MessageList';
import { RiskCard } from '@/components/RiskCard';
import { ChatInput } from '@/components/Chat/ChatInput';
import { QuickActions } from '@/components/QuickActions';
import { useEffect } from 'react';

export const MultiView = () => {
  const currentId = useCaseStore(s => s.currentId);
  const cases = useCaseStore(s => s.cases);
  const current = cases.find(c => c.id === currentId);
  if (!current) return <div className="p-6 text-neutral-400">请选择或新建案件</div>;
  const mode = (current as any).mode || 'multi';
  const result = (current as any).result;
  const locked = (current as any).locked;
  const messages = (current.messages || []).map((m, idx) => ({ id: (m as any).id || `${m.role}-${idx}`, ...m }));

  return (
    <section className="flex flex-col gap-6 p-6">
      <MessageList messages={messages} />
      {locked && result && (
        <RiskCard level={result.risk} tags={result.tags} advice={result.advice} />
      )}
      <ChatInput />
      <QuickActions />
    </section>
  );
}; 