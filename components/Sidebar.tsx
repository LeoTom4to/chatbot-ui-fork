import { ShieldCheck, Menu, FilePlus, BookOpen, Share2, Pencil, FolderPlus, Archive, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useCaseStore } from "@/store/useCaseStore";
import type { Case } from '@/store/useCaseStore';
import { cn } from "@/utils";
import React from "react"; // Added missing import

function SidebarItem({ c, renameId, setRenameId, renameValue, setRenameValue, setShowDelete, showToast }: {
  c: Case;
  renameId: string | null;
  setRenameId: (id: string | null) => void;
  renameValue: string;
  setRenameValue: (v: string) => void;
  setShowDelete: (v: {id:string,title:string}|null) => void;
  showToast: (msg: string) => void;
}) {
  const currentCaseId = useCaseStore(s => s.currentCaseId);
  const setCurrentCaseId = useCaseStore(s => s.setCurrentCaseId);
  const renameCase = useCaseStore(s => s.renameCase);
  const cloneCase = useCaseStore(s => s.cloneCase);
  const deleteCase = useCaseStore(s => s.deleteCase);
  const cases = useCaseStore(s => s.cases);
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{left:number,top:number}|null>(null);

  // 绝对定位菜单
  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setMenuPos({ left: rect.right+2, top: rect.top+4 });
    setMenuOpen(true);
  };
  const closeMenu = () => setMenuOpen(false);

  // 点击外部关闭
  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // 删除后自动切换
  const handleDelete = (id: string) => {
    deleteCase(id);
    setShowDelete(null);
  };

  // 复制后自动切换
  const handleClone = (id: string) => {
    const newId = cloneCase(id);
    setTimeout(() => {
      if (newId) setCurrentCaseId(newId);
    }, 0);
    showToast('已复制');
    closeMenu();
  };

  // 重命名
  const handleRename = (id: string, name: string) => {
    renameCase(id, name);
    setRenameId(null);
    setRenameValue('');
  };

  return (
    <li
      className={cn(
        "group relative flex items-center rounded px-3 py-2 cursor-pointer transition-colors",
        c.id === currentCaseId
          ? "bg-[#1d2b39] text-white font-medium"
          : "text-gray-300 hover:bg-[#2a3b4d] hover:text-white"
      )}
      onClick={() => setCurrentCaseId(c.id)}
    >
      {renameId === c.id ? (
        <input
          className="flex-1 rounded px-2 py-1 text-xs border border-primary outline-none bg-[#23232a] text-white"
          value={renameValue}
          autoFocus
          onChange={e => setRenameValue(e.target.value)}
          onBlur={() => handleRename(c.id, renameValue)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename(c.id, renameValue);
            if (e.key === 'Escape') setRenameId(null);
          }}
        />
      ) : (
        <>
          <span className="truncate flex-1">{c.title}</span>
          {/* 三点按钮，hover 时显示 */}
          <button
            ref={btnRef}
            className="ml-2 opacity-0 group-hover:opacity-100 transition text-lg px-2 py-1 rounded-full hover:bg-black/10 focus:outline-none"
            onClick={openMenu}
            tabIndex={-1}
          >
            ⋯
          </button>
          {/* DropdownMenu 气泡菜单 */}
          {menuOpen && menuPos && (
            <div
              style={{ position: 'fixed', left: menuPos.left, top: menuPos.top, zIndex: 9999, minWidth: 140 }}
              className="rounded-xl bg-white shadow-2xl border border-gray-100 py-1 flex flex-col animate-fade-in-up transition-all duration-200 text-gray-900"
            >
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-[15px] font-normal" onClick={e => { e.stopPropagation(); setRenameId(c.id); setRenameValue(c.title); closeMenu(); }}>重命名</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-[15px] font-normal" onClick={e => { e.stopPropagation(); handleClone(c.id); }}>复制</button>
              <div className="my-1 border-t border-gray-200" />
              <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 text-[15px] font-normal" onClick={e => { e.stopPropagation(); setShowDelete({id:c.id,title:c.title}); closeMenu(); }}>删除</button>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export function Sidebar() {
  const cases = useCaseStore((s) => s.cases);
  const visibleCases = cases.filter((c: Case) => c.messages.length > 0);
  const setCurrentCaseId = useCaseStore((s) => s.setCurrentCaseId);
  const createEmptyCase = useCaseStore((s) => s.createEmptyCase);
  const pendingCaseId = useCaseStore((s) => s.pendingCaseId);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showDelete, setShowDelete] = useState<{id:string,title:string}|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // toast自动消失
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  // 滚动监听，切换分割线/阴影
  const handleHistoryScroll = () => {
    const el = historyScrollRef.current;
    if (el) {
      setIsScrolled(el.scrollTop > 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1f1f23] text-white w-64">
      {/* 顶部功能栏，分割线/阴影仅滚动时出现 */}
      <div className={
        `flex-shrink-0 px-4 py-3 sticky top-0 z-10 bg-[#1f1f23] transition-shadow ${isScrolled ? 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)] border-b border-gray-700' : ''}`
      }>
        <div className="font-bold text-lg flex items-center space-x-2">
          <ShieldCheck className="text-blue-500 w-5 h-5" />
          <span>反诈系统</span>
        </div>
        <div className="mt-3 space-y-2">
          <button
            className="w-full text-left text-sm hover:bg-gray-700 px-3 py-2 rounded"
            onClick={() => {
              if (!pendingCaseId) {
                createEmptyCase();
                setCurrentCaseId(null);
              }
            }}
          >＋ 新建案件</button>
        </div>
        <div className="mt-4 mb-2 px-3 text-xs text-gray-400 font-semibold tracking-widest select-none">
          案件历史
        </div>
      </div>

      {/* 历史案件区，按钮风格 */}
      <div
        ref={historyScrollRef}
        className="flex-1 overflow-y-auto hover:scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        onScroll={handleHistoryScroll}
      >
        <ul className="px-2 py-2 space-y-1 text-xs">
          {visibleCases.length === 0 && <p className="text-sub px-3">暂无案件</p>}
          {visibleCases.map((c: Case) => (
            <SidebarItem
              key={c.id}
              c={c}
              renameId={renameId}
              setRenameId={setRenameId}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              setShowDelete={setShowDelete}
              showToast={showToast}
            />
          ))}
        </ul>
      </div>

      {/* 底部预留 Quick Actions 区域 */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700 min-h-[48px]">
        {/* 这里可插入 <QuickActions /> 或其他操作按钮 */}
      </div>

      {/* 删除确认弹窗 */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-2xl min-w-[320px] text-gray-900">
            <div className="text-lg font-bold mb-2">Delete chat?</div>
            <div className="mb-4">This will delete <b>{showDelete.title}</b>.</div>
            <div className="flex gap-4 justify-end">
              <button className="px-4 py-2 rounded border" onClick={()=>setShowDelete(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={()=>{
                if (showDelete) {
                  useCaseStore.getState().deleteCase(showDelete.id);
                  setShowDelete(null);
                }
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast 提示 */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-black/90 text-white px-6 py-2 rounded-full shadow-lg text-sm">{toast}</div>
      )}
    </div>
  );
} 