import { useCaseStore } from '@/store/useCaseStore';
import { useState } from 'react';

export const ChatInput = () => {
  const current = useCaseStore((s) => s.cases.find((c) => c.id === s.currentId));
  const patch = useCaseStore((s) => s.patchCurrent);
  const [text, setText] = useState('');
  const loading = false; // 可根据实际 loading 状态调整
  const mode = current?.mode || 'single';
  const disabled = !current || current.locked;

  const handleSend = async () => {
    if (!text.trim() || !current) return;
    patch({ messages: [...current.messages, { role: 'user', content: text }] });
    if (current.mode === 'multi') {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: current.mode })
      });
      const { advice } = await res.json();
      patch({
        messages: [
          ...current.messages,
          { role: 'user', content: text },
          { role: 'assistant', content: advice },
        ],
      });
    } else {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: current.mode })
      });
      const data = await res.json();
      patch({
        messages: [...current.messages, { role: 'user', content: text }],
        result: data,
        locked: true,
      });
    }
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={text}
        disabled={disabled}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled
            ? '已锁定，点击“新建案件”以继续'
            : mode === 'multi'
              ? '请输入问题或对话…'
              : '请输入待检测内容…'
        }
        className={`w-full resize-none rounded bg-[#2c2e38] text-text placeholder:text-neutral-400
          ${disabled ? 'cursor-not-allowed opacity-50' : 'focus:border-[#127C9E] hover:border-[#3a3d4a]'}
          border transition-colors p-3`}
        rows={3}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className="absolute right-2 bottom-2 rounded bg-[#127C9E] px-3 py-1 text-sm text-text disabled:opacity-40">
        {mode === 'multi' ? '发送' : 'Analyze'}
      </button>
    </div>
  );
}; 