import { motion } from 'framer-motion';

export const AlertBar = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="fixed bottom-0 left-0 w-full bg-yellow-500 text-black text-center py-2 z-50 shadow-lg"
  >
    <span className="font-semibold">温馨提示：</span>
    本系统仅供学习演示，遇到疑似诈骗请及时报警！
  </motion.div>
); 