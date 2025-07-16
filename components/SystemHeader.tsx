export const SystemHeader = () => (
  <header className="flex items-center justify-between px-6 py-4 border-b border-[#2F80ED]/20 bg-[#0B0F19]">
    <h1 className="text-lg font-semibold text-white tracking-wide">反欺诈分析系统</h1>
    <div className="space-x-2">
      <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[#2F80ED] hover:bg-[#3BA2FF]">单轮模式</button>
      <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#CFCFCF] bg-[#1F2A40] hover:bg-[#2C3E50]">多轮分析</button>
    </div>
  </header>
); 