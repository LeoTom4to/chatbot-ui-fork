import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ActionMenuProps {
  left: number;
  top: number;
  onShare: () => void;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ left, top, onShare, onRename, onDelete, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const menu = (
    <div
      ref={ref}
      style={{ position: 'absolute', left, top, zIndex: 9999 }}
      className="min-w-[150px] rounded-xl bg-white shadow-2xl border border-gray-100 py-1 flex flex-col animate-fade-in-up transition-all duration-200"
    >
      <button className="flex items-center gap-2 px-3 py-2 text-gray-900 text-[15px] font-normal hover:bg-gray-100 transition" onClick={onShare}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v2a4 4 0 004 4h8a4 4 0 004-4v-2"/><path d="M16 6l-4-4-4 4"/></svg>
        分享
      </button>
      <button className="flex items-center gap-2 px-3 py-2 text-gray-900 text-[15px] font-normal hover:bg-gray-100 transition" onClick={onRename}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
        重命名
      </button>
      <div className="my-1 border-t border-gray-200" />
      <button className="flex items-center gap-2 px-3 py-2 text-red-600 text-[15px] font-normal hover:bg-red-50 transition" onClick={onDelete}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6h16z"/></svg>
        删除
      </button>
    </div>
  );
  return ReactDOM.createPortal(menu, document.body);
}; 