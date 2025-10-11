export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateNorm = new Date(date);
  dateNorm.setHours(0, 0, 0, 0);
  const diff = dateNorm.getTime() - today.getTime();
  
  if (diff === 0) return 'Today';
  if (diff === 86400000) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatShortDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const formatLongDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export const getDayName = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });

export const getShortDayName = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });

export const formatDateTime = (dateString: string) => 
  new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

export const formatTime = (dateString: string) => 
  new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

export const getRelativeTime = (dateString: string): string => {
  const ms = new Date(dateString).getTime() - Date.now();
  const sec = Math.abs(Math.floor(ms / 1000));
  const sfx = ms < 0 ? 'ago' : 'from now';
  
  const units: [number, string][] = [
    [Math.floor(sec / 31536000), 'year'],
    [Math.floor(sec / 2592000), 'month'],
    [Math.floor(sec / 86400), 'day'],
    [Math.floor(sec / 3600), 'hour'],
    [Math.floor(sec / 60), 'minute']
  ];
  
  for (const [val, unit] of units) {
    if (val > 0) return `${val} ${unit}${val === 1 ? '' : 's'} ${sfx}`;
  }
  return 'just now';
};

export const isToday = (dateString: string) => 
  new Date(dateString).toDateString() === new Date().toDateString();

export const isTomorrow = (dateString: string) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(dateString).toDateString() === tomorrow.toDateString();
};
