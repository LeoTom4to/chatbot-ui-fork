import { SystemHeader } from './SystemHeader';
export const ChatPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
    <SystemHeader />
    <section className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {children}
    </section>
  </main>
); 