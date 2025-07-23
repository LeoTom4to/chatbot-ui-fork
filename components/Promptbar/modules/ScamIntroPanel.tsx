import React from 'react';
export const ScamIntroPanel = () => (
  <div className="bg-[#23232a] border border-white/10 rounded-xl p-4 shadow mb-4 text-gray-200">
    <div className="font-bold text-yellow-300 mb-2">常见诈骗类型科普</div>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>冒充客服：以退款、快递等为由诱导点击钓鱼链接</li>
      <li>冒充公检法：以涉嫌犯罪为由诱导转账</li>
      <li>中奖诈骗：以中奖为名骗取个人信息或转账</li>
    </ul>
  </div>
); 