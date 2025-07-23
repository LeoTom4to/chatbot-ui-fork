import { motion } from 'framer-motion';

const knowledgeList = [
  { title: '冒充客服', desc: '常见于退款、快递等场景，诱导点击钓鱼链接。' },
  { title: '冒充公检法', desc: '以涉嫌犯罪为由，诱导转账。' },
  { title: '中奖诈骗', desc: '以中奖为名，骗取个人信息或转账。' },
];

export const KnowledgeSlider = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
    className="w-full max-w-xl"
  >
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {knowledgeList.map((item, idx) => (
        <div
          key={idx}
          className="min-w-[220px] bg-[#23232a] rounded-lg shadow p-4 flex-shrink-0"
        >
          <div className="text-lg font-semibold text-blue-400 mb-1">{item.title}</div>
          <div className="text-gray-300 text-sm">{item.desc}</div>
        </div>
      ))}
    </div>
  </motion.div>
); 