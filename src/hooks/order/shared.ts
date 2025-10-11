export const formatDate = (date: Date | string, format: 'short' | 'long' = 'long') => 
  (typeof date === 'string' ? new Date(date) : date).toLocaleDateString('en-US', 
    format === 'long' 
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }
  );
