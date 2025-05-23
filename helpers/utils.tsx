
export const truncate = ({ chars, length }: { chars: string | null; length: number }) => {
  return chars ? `${chars?.substring(0, length)}` : '';
};

export const getTime = (timestamp: string | null | undefined | Date): string => {
  if (!timestamp) return '';
  const givenDate = new Date(timestamp);

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getLastChatTime = (lastChatDate: Date): string => {
    const currentDate = new Date();
    const lastChatDay = lastChatDate.getDate();
    const currentDay = currentDate.getDate();
    if (currentDay === lastChatDay) {
      return formatTime(lastChatDate);
    } else if (currentDay - lastChatDay === 1) {
      return 'Yesterday';
    } else {
      return formatDate(lastChatDate);
    }
  };

  return getLastChatTime(givenDate);
};

export const getDate = (dateStr: string): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [day, month, year] = dateStr.split('/').map(Number);
  const monthName = months[month - 1];

  return `${monthName} ${day}, ${year}`;
};

export const getURL = (url: string) => {
  return process.env.NEXT_PUBLIC_API_HOST + url;
};
export const formatTimeSince = (date: string | Date | undefined): string => {
  if (!date) return '';

  const now = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return pastDate.toLocaleDateString();
};

export const getChatUrl = (id: number) => {
  return `/chats/main/${id}`;
};

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
