import { APP_TITLE, APP_SLOGAN } from '@/utils/app/branding';

export const EmptyScreen = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4 pt-16">
    {/* 顶部标题 */}
    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide mb-2">
      {APP_TITLE}
    </h1>

    {/* 副标题 / 标语 */}
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
      {APP_SLOGAN}
    </p>

    {/* 可选：放一个渐隐的小提示 */}
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-10">
      在下方输入框粘贴或键入短信内容，秒速出结果 →
    </p>
  </div>
); 