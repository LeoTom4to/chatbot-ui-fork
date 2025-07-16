import { useCaseStore } from '@/store/useCaseStore';
import { useState } from 'react';

export const CaseSidebar = () => {
  const cases = useCaseStore((s) => s.cases);
  const currentId = useCaseStore((s) => s.currentId);
  const addCase = useCaseStore((s) => s.addCase);
  const switchCase = useCaseStore((s) => s.switchCase);
  const deleteCase = useCaseStore((s) => s.deleteCase);
  const renameCase = useCaseStore((s) => s.renameCase);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showDelete, setShowDelete] = useState<{id:string,title:string}|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const pendingCaseId = useCaseStore((s) => s.pendingCaseId);
  const setPendingCaseId = useCaseStore((s) => s.setPendingCaseId);
  const createPendingCase = useCaseStore((s) => s.createPendingCase);

  // 删除后跳转首页
  const handleDelete = (id: string) => {
    deleteCase(id);
    setShowDelete(null);
    window.location.href = '/';
  };

  // toast自动消失
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <aside className="w-60 bg-card p-4 text-sm text-text border-r border-line relative">
      <button onClick={() => {
        if (!pendingCaseId) {
          createPendingCase();
        }
      }} className="mb-4 w-full rounded bg-primary py-2 text-text font-semibold hover:bg-primary/90 transition">
        + 新建案件
      </button>
      {cases.length === 0 && <p className="text-sub">暂无案件</p>}
      <ul className="space-y-2">
        {cases.map((c) => (
          <li
            key={c.id}
            className={`group relative rounded px-3 py-2 transition flex items-center justify-between ${c.id === currentId ? 'bg-primary/20' : 'hover:bg-bg/60'} text-text`}
          >
            {renameId === c.id ? (
              <input
                className="flex-1 rounded px-2 py-1 text-sm border border-primary outline-none"
                value={renameValue}
                autoFocus
                onChange={e => setRenameValue(e.target.value)}
                onBlur={() => { renameCase(c.id, renameValue); setRenameId(null); }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { renameCase(c.id, renameValue); setRenameId(null); }
                  if (e.key === 'Escape') setRenameId(null);
                }}
              />
            ) : (
              <div className="truncate flex-1 cursor-pointer" onClick={() => switchCase(c.id)}>{c.title}</div>
            )}
            <button
              className="ml-2 opacity-0 group-hover:opacity-100 transition"
              onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === c.id ? null : c.id); }}
            >
              <span className="text-lg">⋯</span>
            </button>
            {menuOpenId === c.id && (
              <div className="absolute right-8 top-2 z-10 bg-white border border-line rounded shadow-lg w-32 text-gray-900">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => { showToast('该功能正在生成中'); setMenuOpenId(null); }}>Share</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => { setRenameId(c.id); setRenameValue(c.title); setMenuOpenId(null); }}>Rename</button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600" onClick={() => { setShowDelete({id:c.id,title:c.title}); setMenuOpenId(null); }}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* 删除确认弹窗 */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-2xl min-w-[320px] text-gray-900">
            <div className="text-lg font-bold mb-2">Delete chat?</div>
            <div className="mb-4">This will delete <b>{showDelete.title}</b>.</div>
            <div className="flex gap-4 justify-end">
              <button className="px-4 py-2 rounded border" onClick={()=>setShowDelete(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={()=>handleDelete(showDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast 提示 */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-black/90 text-white px-6 py-2 rounded-full shadow-lg text-sm">{toast}</div>
      )}
    </aside>
  );
}; 