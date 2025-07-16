import { useCaseStore } from '@/store/useCaseStore';
import { MessageList } from '@/components/MessageList';
import { RiskCard } from '@/components/RiskCard';
import { ModeToggle } from './ModeToggle';
import React from 'react';

export const AnalysisContent = () => {
  const currentId = useCaseStore(s => s.currentId);
  const cases = useCaseStore(s => s.cases);
  const current = cases.find(c => c.id === currentId);
  if (!current) return <div className="p-6 text-neutral-400">请选择或新建案件</div>;
  // 兼容 mode/result/locked 字段
  const mode = (current as any).mode || 'multi';
  const result = (current as any).result;
  const locked = (current as any).locked;
  // 兼容 MessageList 需要 id 字段
  const messages = (current.messages || []).map((m, idx) => ({ id: (m as any).id || `${m.role}-${idx}`, ...m }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {mode === 'multi' && <MessageList messages={messages} />}
        {result && (mode === 'single' || locked) && (
          <RiskCard level={result.risk} tags={result.tags} advice={result.advice} />
        )}
      </div>
    </div>
  );
}; 