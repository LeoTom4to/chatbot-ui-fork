import React from 'react';
export const SidebarCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`rounded-xl bg-[#23232a] border border-line px-4 py-4 shadow max-w-[320px] w-full mx-auto mb-2 ${className || ''}`}>
    {children}
  </div>
); 