import { useState } from 'react';
import { motion } from 'framer-motion';

export const InputPanel = ({ onResult }: { onResult: (r: any) => void }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    // TODO: 调用 /api/classify
    setTimeout(() => {
      onResult({
        判断: '是诈骗',
        类型: '冒充客服',
        风险等级: '高',
        可信度: '95%',
        判断依据: '示例：包含“退款”“点击链接”等关键词',
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full max-w-xl bg-[#23232a] rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center"
    >
      <textarea
        className="w-full h-24 rounded-md bg-[#18181c] text-white p-3 mb-4 resize-none border border-white/10 focus:border-blue-400 outline-none transition"
        placeholder="请粘贴或输入待检测的短信内容…"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
      />
      <button
        className="px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-60"
        onClick={handleDetect}
        disabled={!input.trim() || loading}
      >
        {loading ? '检测中…' : '一键检测'}
      </button>
    </motion.div>
  );
}; 