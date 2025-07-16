import { useCaseStore } from '@/store/useCaseStore';

const label = {
  single: '单轮模式',
  multi: '多轮分析',
};

export const ModeToggle = () => {
  const current = useCaseStore(s => s.cases.find(c => c.id === s.currentId));
  const patch = useCaseStore(s => s.patchCurrent);

  if (!current) return null;

  return (
    <div className="flex gap-2">
      {(['single', 'multi'] as const).map((m) => (
        <button
          key={m}
          onClick={() => patch({ mode: m })}
          className={`rounded px-4 py-1.5 text-sm font-semibold transition-colors
            ${current.mode === m
              ? 'bg-[#127C9E] text-text'
              : 'bg-[#2d2f3a] text-neutral-300 hover:bg-[#3a3d4a]'}`}
        >
          {label[m]}
        </button>
      ))}
    </div>
  );
}; 