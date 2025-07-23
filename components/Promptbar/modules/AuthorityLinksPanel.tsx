import React, { FC } from 'react';
import { SidebarCard } from './SidebarCard';

export const AuthorityLinksPanel: FC<{ result: any }> = ({ result }) => {
  const links = result.authorities ?? [];
  if (!links.length) return null;

  return (
    <SidebarCard>
      <h3 className="font-bold text-base mb-2 text-blue-400">权威链接</h3>
      <ul className="pl-4 space-y-1 list-disc list-inside">
        {links.map((l: any) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener" className="text-blue-400 underline">
              {l.name} ↗
            </a>
          </li>
        ))}
      </ul>
    </SidebarCard>
  );
}; 