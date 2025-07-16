import clsx from 'clsx';
export const ChatMessage = ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
  const isUser = role === 'user';
  return (
    <div className={clsx(
      'max-w-3xl mx-auto px-4 py-2',
      isUser ? 'text-right' : 'text-left'
    )}>
      <div className={clsx(
        'inline-block px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow-md',
        isUser
          ? 'bg-gradient-to-br from-[#2F80ED] to-[#3BA2FF] text-white rounded-br-none'
          : 'bg-[#1F2A40] text-[#E0E0E0] rounded-bl-none'
      )}>
        {content}
      </div>
    </div>
  );
} 