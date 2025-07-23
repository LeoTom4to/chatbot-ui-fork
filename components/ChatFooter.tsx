import { useCaseStore } from '@/store/useCaseStore';
import { useState, useRef } from 'react';
import { Send as SendIcon, Plus as PlusIcon, Mic as MicIcon, Settings as SettingsIcon, SlidersHorizontal } from 'lucide-react';
import { useEffect } from 'react';

export const ChatFooter = () => {
  const current = useCaseStore((s) => s.cases.find((c) => c.id === s.currentId));
  const patch = useCaseStore((s) => s.patchCurrent);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const disabled = !current || current.locked || loading || aiLoading;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showTools, setShowTools] = useState(false);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    if (!showTools) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        toolsBtnRef.current &&
        !toolsBtnRef.current.contains(e.target as Node)
      ) {
        setShowTools(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTools]);

  // 工具栏功能处理
  const handleToolAction = async (type: 'explain' | 'similar' | 'export') => {
    if (!current) return;
    if (type === 'export') {
      // 导出当前案件分析结果为 TXT
      let content = '';
      if (current.messages && current.messages.length > 0) {
        content += '【对话记录】\n';
        current.messages.forEach((msg) => {
          content += `[${msg.role === 'user' ? '用户' : 'AI'}] ${msg.content}\n`;
        });
      }
      if (current.result) {
        content += '\n【分析结果】\n';
        content += `风险等级：${current.result.risk_level}\n标签：${(current.result.risk_tags || []).join('、') || '-'}\n依据：${current.result.reasoning || '-'}`;
      }
      if (!content) {
        alert('暂无可导出的内容');
        return;
      }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `反欺诈分析-${current.title || '案件'}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      return;
    }
    if (!text.trim()) {
      alert('请输入要分析的内容');
      return;
    }
    setLoading(true);
    setAiLoading(true);
    try {
      const res = await fetch('/api/jiutian/chat?type=' + type, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text })
      });
      const { fraud_judgment } = await res.json();
      if (!res.ok) throw new Error('分析失败');
      const assistantMsg = { id: crypto.randomUUID(), role: 'assistant' as const, content: fraud_judgment?.reasoning || '无结果' };
      const latest = useCaseStore.getState().cases.find((c) => c.id === current.id);
      patch({ messages: [...(latest?.messages || []), assistantMsg] });
      setShowTools(false);
    } catch (err: any) {
      alert(err.message || '分析失败');
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !current) return;
    setLoading(true);
    setAiLoading(true);
    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    const latestCurrent = useCaseStore.getState().cases.find((c) => c.id === current.id);
    patch({ messages: [...(latestCurrent?.messages || []), userMsg] });
    try {
      const res = await fetch('/api/jiutian/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text })
      });
      const { fraud_judgment } = await res.json();
      if (!res.ok) throw new Error('分析失败');
        patch({
        messages: [...(latestCurrent?.messages || []), userMsg, { id: crypto.randomUUID(), role: 'assistant', content: fraud_judgment?.reasoning || '无结果' }],
        result: fraud_judgment,
          locked: true,
        });
      setText('');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } catch (err: any) {
      alert(err.message || '分析失败');
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  if (!current || (current.mode === 'single' && current.locked)) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-30">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-2 rounded-full bg-white dark:bg-white shadow-lg px-8 py-4 focus-within:ring-2 focus-within:ring-primary border border-transparent hover:border-primary/40 transition-all duration-200">
          {/* 输入框 */}
          <textarea
            ref={textareaRef}
            value={text}
            disabled={disabled}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !disabled) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === 'Enter' && e.shiftKey) {
                // 允许换行
              }
            }}
            placeholder="Ask anything"
            className="flex-1 resize-none bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400 dark:text-gray-900 max-h-16 py-1 px-0"
            rows={1}
          />
          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={disabled}
            aria-label="发送"
            className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 ml-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Tools 按钮和菜单 */}
        <div className="flex justify-start mt-4 relative">
          <button
            ref={toolsBtnRef}
            className="flex items-center gap-2 h-11 px-6 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition text-gray-900 text-base font-medium shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setShowTools((v) => !v)}
            type="button"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Tools</span>
          </button>
          {showTools && (
            <div
              ref={menuRef}
              className="absolute left-0 bottom-14 z-50 w-72 rounded-2xl bg-white shadow-2xl border border-line py-2 flex flex-col animate-fade-in-up transition-all duration-200"
              style={{ minWidth: 260 }}
            >
              <MenuItem icon={<SlidersHorizontal className="h-5 w-5" />} text="解释欺诈" onClick={() => handleToolAction('explain')} />
              <MenuItem icon={<PlusIcon className="h-5 w-5" />} text="相似案例" onClick={() => handleToolAction('similar')} />
              <MenuItem icon={<SettingsIcon className="h-5 w-5" />} text="导出结果" onClick={() => handleToolAction('export')} />
            </div>
          )}
        </div>
        {/* 移除原有下方工具栏按钮 */}
        <div className="text-center text-xs text-sub mt-2">
          九天大模型 can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

// 菜单项组件
function MenuItem({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <button
      className="flex items-center gap-3 px-6 py-4 text-base text-gray-900 hover:bg-primary/10 active:bg-primary/20 transition rounded-xl text-left focus:outline-none focus:bg-primary/10"
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
} 