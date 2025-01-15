const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const date = new Date(timestamp);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
    return 'Yesterday';
  } else if (date >= new Date(now.setDate(now.getDate() - 6))) {
    return weekdays[date.getDay()];
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const Separator = ({ timestamp }: { timestamp: Date }) => {
  return (
    <div className='flex flex-grow items-center justify-center my-2'>
      <p className='dark:bg-neutral-800 text-sm dark:text-neutral-400 bg-neutral-200 text-neutral-800 py-0.5 px-4 rounded-lg'>
      {formatTimestamp(timestamp)}
      </p>
    </div>
  );
};
