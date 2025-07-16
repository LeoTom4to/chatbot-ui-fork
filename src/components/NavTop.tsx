import Link from 'next/link';
import { useRouter } from 'next/router';

export const NavTop: React.FC<{ mode: 'single' | 'multi' }> = ({ mode }) => {
  const { pathname } = useRouter();
  const btnCls = (active: boolean) =>
    `rounded px-4 py-2 text-sm font-medium ${
      active ? 'bg-[#127C9E] text-text' : 'bg-card/5 text-neutral-300'
    }`;
  return (
    <header className="flex items-center gap-4 bg-bg px-6 py-3">
      <h1 className="flex-1 text-lg font-bold text-text">反欺诈分析系统</h1>
      <Link href="/single" className={btnCls(pathname === '/single')}>
        单轮模式
      </Link>
      <Link href="/multi" className={btnCls(pathname === '/multi')}>
        多轮分析
      </Link>
    </header>
  );
}; 