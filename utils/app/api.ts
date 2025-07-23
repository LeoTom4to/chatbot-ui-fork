import { Plugin, PluginID } from '@/types/plugin';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/jiutian/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }

  return 'api/jiutian/chat';
};
