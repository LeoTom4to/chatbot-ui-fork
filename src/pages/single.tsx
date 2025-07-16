import { NavTop } from '@/components/NavTop';
import { SingleView } from '@/components/Single/SingleView';
import { CaseSidebar } from '@/components/CaseSidebar';

export default function SinglePage() {
  return (
    <div className="flex h-screen">
      <CaseSidebar />
      <main className="flex-1 overflow-hidden">
        <NavTop mode="single" />
        <SingleView />
      </main>
    </div>
  );
} 