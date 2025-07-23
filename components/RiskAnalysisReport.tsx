import React, { useState } from 'react';

interface FraudJudgment {
  fraud_type: string;
  risk_level: string;
}

interface AnalysisReport {
  fraud_judgment?: any;
  stats?: any;
  tips?: any;
  authorities?: any;
}

export const RiskAnalysisReport = ({ fraud_judgment }: { fraud_judgment: FraudJudgment }) => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/jiutian/analysis-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fraud_type: fraud_judgment.fraud_type,
          risk_level: fraud_judgment.risk_level,
        }),
      });
      if (!res.ok) throw new Error('服务异常');
      const data = await res.json();
      setReport(data);
    } catch (e: any) {
      setError(e.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#23232a] rounded-xl p-4 shadow mb-4 text-white">
      <button
        className="px-4 py-2 rounded bg-blue-500 text-white font-semibold mb-4"
        onClick={fetchReport}
        disabled={loading}
      >
        {loading ? '分析中…' : '获取分析报告'}
      </button>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {report && (
        <>
          {report.stats && (
            <div className="mb-2">
              <h3 className="font-bold text-lg mb-1">风险统计</h3>
              <pre className="bg-[#18181c] rounded p-2 text-xs">{JSON.stringify(report.stats, null, 2)}</pre>
            </div>
          )}
          {report.tips && (
            <div className="mb-2">
              <h3 className="font-bold text-lg mb-1">防骗建议</h3>
              <ul className="list-disc pl-5 text-sm">
                {Array.isArray(report.tips)
                  ? report.tips.map((tip, i) => <li key={i}>{tip}</li>)
                  : <li>{report.tips}</li>}
              </ul>
            </div>
          )}
          {report.authorities && (
            <div className="mb-2">
              <h3 className="font-bold text-lg mb-1">权威机构</h3>
              <pre className="bg-[#18181c] rounded p-2 text-xs">{JSON.stringify(report.authorities, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 