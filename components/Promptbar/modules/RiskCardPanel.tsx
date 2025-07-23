import React, { useState } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import type { AnalysisData } from '@/types/analysis';
import { SAFE_FALLBACK } from '@/ui/constants/safeFallback';

interface RiskCardPanelProps {
  result: AnalysisData;
  isHighlight?: boolean;
  showExamples?: boolean;
  onToggleExamples?: () => void;
  onQuickAction?: (type: 'report' | 'copy' | 'export') => void;
  children?: React.ReactNode;
}

const RiskActions = ({ result }: { result: any }) => {
  const handleReport = () => {
    window.open('https://www.12377.cn/', '_blank'); // 跳转举报网站
  };
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert('已复制到剪贴板');
    }
  };
  const handleExport = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '风控分析.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-1 text-gray-300 text-lg font-bold mb-2">
      <button onClick={handleReport}>举报</button>
      <button onClick={handleCopy}>复制</button>
      <button onClick={handleExport}>导出</button>
    </div>
  );
};

export const RiskCardPanel = ({
  result,
  isHighlight = false,
  showExamples = false,
  onToggleExamples,
  onQuickAction,
  children
}: RiskCardPanelProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const isScam = result?.is_scam || result?.判断 === '是诈骗';
  const type = result.类型 || result.fraud_type || '';
  const level = result.风险等级 || result.risk_level || '-';
  const confidence = result.可信度;
  const reasoning = result.判断依据 || result.reasoning || '-';
  const examples = result.类似诈骗短信 ?? [];

  // 静态态（无诈骗）
  if (!isScam) {
    return (
      <div className="border-dashed border-2 border-neutral-600/40 bg-[#1f2737]/60 rounded-xl p-6 hover:border-neutral-400 transition-transform hover:scale-105 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-blue-400" size={28} />
          <span className="text-gray-100 font-bold text-lg">暂无明显风险</span>
        </div>
        {/* 占位插画 */}
        <svg width="120" height="120" className="my-4" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#22304a" stroke="#3b82f6" strokeWidth="4" /><text x="60" y="70" textAnchor="middle" fill="#3b82f6" fontSize="32">🛡️</text></svg>
        <ul className="text-gray-200 text-sm space-y-1 mb-4">
          <li>不要轻易点陌生链接</li>
          <li>验证码只对你本人有效</li>
        </ul>
        <button className="btn btn-primary w-full mb-2" onClick={()=>window.open('https://kefu.example.com','_blank')}>仍有疑虑，人工咨询›</button>
        {/* TipsPanel/Authorities 可折叠 */}
        <details className="w-full mt-2">
          <summary className="cursor-pointer text-blue-300 text-sm">安全建议 & 权威链接</summary>
          <div className="mt-2">
            <div className="font-bold text-pink-400 mb-1">防骗Tips</div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-pink-300">
              {SAFE_FALLBACK.tips.map((tip: string) => <li key={tip}>{tip}</li>)}
            </ul>
            <div className="font-bold text-cyan-300 mt-3 mb-1">权威链接</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><a href="https://www.12377.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">国家反诈中心</a></li>
              <li><a href="https://www.mps.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">公安部官网</a></li>
            </ul>
          </div>
        </details>
      </div>
    );
  }

  // 新样式实现
  const handleReport = () => {
    window.open('https://www.12377.cn/', '_blank');
  };
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert('已复制到剪贴板');
    }
  };
  const handleExport = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '风控分析.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`bg-[#23232a] border border-yellow-400 rounded-xl px-4 py-5 mb-4 shadow max-w-[320px] w-full mx-auto transition-transform ${isHighlight ? 'ring-2 ring-yellow-400 scale-[1.02]' : ''}` + (collapsed ? ' h-16 overflow-hidden' : '')}>
      {/* 标题和按钮组分行，按钮组右对齐且不溢出 */}
      <div className="mb-1">
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle size={18} className="text-yellow-400" />
          <span className="font-bold text-yellow-200 text-base whitespace-nowrap">诈骗判定：{type}</span>
        </div>
        <div className="flex gap-1 justify-end">
          <button className="text-xs text-gray-300 font-medium px-1 py-0.5 rounded hover:bg-yellow-50/10" onClick={handleReport}>举报</button>
          <button className="text-xs text-gray-300 font-medium px-1 py-0.5 rounded hover:bg-yellow-50/10" onClick={handleCopy}>复制</button>
          <button className="text-xs text-gray-300 font-medium px-1 py-0.5 rounded hover:bg-yellow-50/10" onClick={handleExport}>导出</button>
        </div>
      </div>
      {/* 风险等级/可信度 */}
      <div className="flex items-center gap-4 mb-1 mt-1">
        <span className="text-yellow-300 font-bold">风险等级：{level}</span>
        {confidence && confidence !== '-' && <span className="text-gray-300">可信度：{confidence}</span>}
      </div>
      {/* 判定依据 */}
      <div className="text-xs text-gray-200 mb-3 leading-relaxed">判定依据：{reasoning}</div>
      {/* 展开按钮/类似短信 */}
      {examples.length > 0 && (
        <div className="mb-2">
          <button className="text-blue-400 text-xs hover:underline" onClick={()=>setCollapsed(v=>!v)}>
            {collapsed ? '收起解释 ▲' : '查看更多解释 ▼'}
          </button>
          {!collapsed && (
            <ul className="mt-1 text-xs list-disc list-inside text-gray-400 space-y-1 max-h-[100px] overflow-y-auto">
              {examples.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {children}
      {/* 官方防骗建议高亮展示（可缩放+美化） */}
      {(result.recommendation || result.建议) && (
        <div
          className={
            'mt-4 rounded border-l-4 border-yellow-400 bg-[#fffbe6] px-3 py-2 text-yellow-900 text-sm relative transition-all duration-200'
          }
          style={{
            maxHeight: showRecommendation ? undefined : 32,
            overflow: showRecommendation ? 'visible' : 'hidden',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setShowRecommendation(v => !v)}
          title={showRecommendation ? '点击收起' : '点击展开'}
        >
          <strong>官方建议：</strong>
          <span
            className={
              showRecommendation
                ? ''
                : 'inline-block align-bottom max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis'
            }
          >
            {result.recommendation || result.建议}
          </span>
          {/* 渐变遮罩，仅收起时显示 */}
          {!showRecommendation && (
            <span
              className="absolute right-6 top-0 h-full w-12 bg-gradient-to-l from-[#fffbe6] to-transparent pointer-events-none"
            />
          )}
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-yellow-600 font-bold">
            {showRecommendation ? '▲ 收起' : '▼ 展开'}
          </span>
        </div>
      )}
    </div>
  );
}; 