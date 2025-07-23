import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const Hero = () => (
  <motion.section
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="w-full max-w-2xl text-center py-12"
  >
    <div className="flex justify-center items-center gap-3 mb-4">
      <ShieldCheck size={40} className="text-blue-400 drop-shadow" />
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent tracking-tight">
        AI 断案：金融诈骗速判所
      </h1>
    </div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="text-lg text-gray-400 mb-2"
    >
      智能识别短信诈骗，守护你的金融安全
    </motion.p>
  </motion.section>
); 