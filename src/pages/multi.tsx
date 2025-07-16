import { NavTop } from '@/components/NavTop';
import { MultiView } from '@/components/Multi/MultiView';
import { CaseSidebar } from 'components/CaseSidebar';

export default function MultiPage() {
  return (
    <div className="flex h-screen">
      <CaseSidebar />
      <main className="flex-1 overflow-hidden">
        <NavTop mode="multi" />
        <MultiView />
      </main>
    </div>
  );
} 