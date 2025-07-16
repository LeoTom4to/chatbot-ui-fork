import React, { useEffect, useRef, useState } from 'react';
import { ActionMenu } from './ActionMenu';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages?: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // 处理三点菜单点击，记录位置
  const handleMenuClick = (e: React.MouseEvent, msgId: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuOpenId(msgId);
    setMenuPos({ left: rect.right, top: rect.bottom });
  };

  // 关闭菜单
  const handleCloseMenu = () => {
    setMenuOpenId(null);
    setMenuPos(null);
  };

  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text select-none py-12">
        <div className="text-2xl font-bold mb-2">欢迎使用反欺诈分析系统</div>
        <div className="mb-4 text-base text-sub">请输入待检测内容或提问，系统将为您智能分析风险。</div>
        <ul className="text-sm text-sub space-y-1">
          <li>• 支持标准、严格、多轮分析模式</li>
          <li>• 可导出分析报告、获取相似案例</li>
          <li>• 输入后点击“发送”或回车即可开始</li>
        </ul>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`group relative max-w-[75%] px-6 py-4 rounded-3xl text-base whitespace-pre-line transition-all duration-200 shadow-lg
            ${msg.role === 'user'
              ? 'self-end bg-gradient-to-br from-primary to-accent text-white rounded-br-2xl shadow-primary/20'
              : 'self-start bg-white dark:bg-[#f7f8fa] text-gray-900 border border-line rounded-bl-2xl shadow-gray-300/30'}
            hover:scale-[1.02] active:scale-100`}
          onMouseEnter={() => setHoveredId(msg.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* 三点按钮，仅在悬停时显示 */}
          <button
            className={`absolute top-2 right-4 text-lg px-2 py-1 rounded-full bg-black/10 text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-150 ${hoveredId === msg.id ? 'opacity-100' : ''}`}
            style={{ fontSize: 20 }}
            onClick={e => handleMenuClick(e, msg.id)}
            tabIndex={-1}
          >
            ⋯
          </button>
          {menuOpenId === msg.id && menuPos && (
            <ActionMenu
              left={menuPos.left}
              top={menuPos.top}
              onShare={() => {}}
              onRename={() => {}}
              onDelete={() => {}}
              onClose={handleCloseMenu}
            />
          )}
          {msg.content}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}; 