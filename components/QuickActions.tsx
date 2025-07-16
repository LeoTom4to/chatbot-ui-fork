import { useCaseStore } from '@/store/useCaseStore';

export const QuickActions = () => {
  const current = useCaseStore(s => s.cases.find(c => c.id === s.currentId));
  const patch = useCaseStore(s => s.patchCurrent);
  const disabled = !current || current.locked;

  const runAction = async (type: 'explain' | 'similar' | 'export') => {
    if (!current) return;
    if (type === 'export') {
      if (!current.result) return;
      const blob = new Blob([JSON.stringify(current.result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fraud-report.json';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (type === 'explain' || type === 'similar') {
      patch({
        messages: [
          ...current.messages,
          { id: crypto.randomUUID(), role: 'user', content: type === 'explain' ? '请解释本轮分析' : '请给出相似案例' },
          { id: crypto.randomUUID(), role: 'assistant', content: type === 'explain' ? '这是对本轮分析的详细解释。' : '这里是一些相似案例：案例A、案例B。' },
        ],
      });
    }
  };

  const endChat = async () => {
    if (!current || current.locked) return;
    patch({ locked: true });
    const res = await fetch('/api/analyze?type=summary', {
      method: 'POST',
      body: JSON.stringify({ history: current.messages })
    });
    const data = await res.json();
    patch({ result: data });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center gap-4 bg-bg py-3 shadow-[0_-2px_6px_rgba(0,0,0,0.4)]">
      <button
        disabled={disabled}
        onClick={() => runAction('explain')}
        className="rounded-md bg-[#127C9E] px-4 py-2 text-sm text-text disabled:opacity-40"
      >
        Explain&nbsp;Fraud
      </button>
      <button
        disabled={disabled}
        onClick={() => runAction('similar')}
        className="rounded-md bg-[#127C9E] px-4 py-2 text-sm text-text disabled:opacity-40"
      >
        Similar&nbsp;Cases
      </button>
      <button
        disabled={!current?.result}
        onClick={() => runAction('export')}
        className="rounded-md bg-[#127C9E] px-4 py-2 text-sm text-text disabled:opacity-40"
      >
        Export&nbsp;Result
      </button>
      <button
        disabled={disabled}
        onClick={endChat}
        className="rounded-md bg-red-600 px-4 py-2 text-sm text-text disabled:opacity-40"
      >
        结束对话
      </button>
    </div>
  );
}; 