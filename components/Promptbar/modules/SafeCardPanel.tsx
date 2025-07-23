import { ShieldCheck, AlertTriangle, ChevronDown, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface SafeCardPanelProps {
  lastChecked: Date;
}

export const SafeCardPanel = ({ lastChecked }: SafeCardPanelProps) => {
  const [expand, setExpand] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (progress < 12) {
      const id = setTimeout(() => setProgress(progress + 1), 40);
      return () => clearTimeout(id);
    }
  }, [progress]);

  return (
    <div className="relative rounded-xl border border-emerald-500/40
                bg-gradient-to-br from-[#1f2937] to-[#111827]
                p-4 shadow-[0_0_12px_#34d39940] backdrop-blur-sm">

      {/* 标题 */}
      <h2 className="mb-1 flex items-center gap-1 text-lg font-bold text-white/95">
        <ShieldCheck size={18} className="text-emerald-400" />
        暂未发现明显诈骗风险
      </h2>

      {/* 副标 */}
      <p className="mb-3 text-sm text-gray-400">
        最后检测：{dayjs(lastChecked).format('HH:mm')} • 如有疑虑请继续咨询
      </p>

      {/* 风险指数条 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-gray-500">风险指数 {(progress/100).toFixed(2)} / 1</span>
        <div className="h-1 flex-1 overflow-hidden rounded bg-gray-700/50">
          <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 核心 Tips */}
      <ul className="space-y-2 text-[15px] leading-snug text-gray-300">
        {[
          '不要轻易点击短信中的任何链接或二维码',
          '陌生号码要求转账、验证码 → 一律再三核实',
          '下载官方 App / 拨打官方客服电话是最安全的验证方式',
        ].map((tip) => (
          <li key={tip} className="grid grid-cols-[16px_1fr] gap-2 items-start">
            <span className="flex justify-end"><AlertTriangle size={16} className="mt-[2px] flex-none text-emerald-400" /></span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      {/* 折叠防骗知识 */}
      <button
        onClick={() => setExpand(!expand)}
        className="group mt-4 flex w-full items-center justify-center gap-1 text-xs text-emerald-400/80 hover:text-emerald-300"
      >
        {expand ? '收起防骗知识' : '展开防骗知识'}
        <ChevronDown
          size={14}
          className={`transition-transform ${expand ? 'rotate-180' : ''}`}
        />
      </button>

      {expand && (
        <div className="mt-3 rounded-md bg-gray-700/30 p-3 text-xs text-gray-300 backdrop-blur-sm">
          <p className="mb-1 font-semibold text-emerald-300">三不要一谨记：</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>不要点陌生链接</li>
            <li>不要泄露验证码</li>
            <li>不要随意转账</li>
            <li>谨记官方渠道核实</li>
          </ul>
        </div>
      )}

      {/* 权威背书 */}
      <div className="mt-6 flex items-center justify-between rounded-md border border-gray-600/40 bg-gray-800/60 p-2 pr-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-blue-400 drop-shadow" />
          数据来源 · 国家反诈中心
        </div>
        <a
          href="https://www.12377.cn/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300"
        >
          详情
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}; 