import { motion } from 'framer-motion';
export const AnalyzeStatus = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <div className="bg-[#23232a] border border-white/10 rounded-xl p-4 shadow mb-4 flex flex-col items-center">
      <div className="w-2/3 h-4 bg-[#18181c] rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        />
      </div>
      <div className="text-gray-300 text-xs mt-1">AI 正在分析中，请稍候…</div>
    </div>
  );
}; 