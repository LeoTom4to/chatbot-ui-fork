import { useCaseStore } from '@/store/useCaseStore';
import { useRiskAnalysisStore } from '@/store/useRiskAnalysisStore';
import { useState } from 'react';

export const ChatInput = () => {
  const current = useCaseStore((s) => s.cases.find((c) => c.id === s.currentId));
  // const patch = useCaseStore((s) => s.patchCurrent); // 移除
  const [text, setText] = useState('');
  const { setAllResult, setLoading } = useRiskAnalysisStore();
  const mode = (current as any)?.mode || 'single';
  const disabled = !current || (current as any)?.locked;

  const handleSend = async () => {
    if (!text.trim() || !current) return;
    // 聊天流：主窗口显示自然语言
    // patch({ messages: [...current.messages, { role: 'user', content: text }] });
    current.messages.push({ role: 'user', content: text });
    setLoading(true);
    try {
      // ① 聊天流
      const chatRes = await fetch('/api/jiutian/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text })
      });
      const { output: assistantText } = await chatRes.json();
      current.messages.push({ role: 'assistant', content: assistantText });

      // ② 结构化判定流
      const judgeRes = await fetch('/api/jiutian/structured-judgment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const { fraud_judgment } = await judgeRes.json();
      setAllResult({ fraud_judgment });

      // ③ 深度分析流（仅诈骗时）
      if (fraud_judgment?.is_scam) {
        const analysisRes = await fetch('/api/jiutian/analysis-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fraud_type: fraud_judgment.fraud_type,
            risk_level: fraud_judgment.risk_level,
          }),
        });
        const analysis = await analysisRes.json();
        setAllResult({ ...analysis, fraud_judgment });
      } else {
        setAllResult({ fraud_judgment });
    }
    } catch (e) {
      // 可加错误提示
    } finally {
      setLoading(false);
    setText('');
    }
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