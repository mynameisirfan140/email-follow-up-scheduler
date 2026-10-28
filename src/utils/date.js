```javascript
/**
 * Date manipulation helpers used throughout the codebase.
 */

export const formatDate = (date, options = {}) => {
  const { year = 'numeric', month = '2-digit', day = '2-digit', hour = '2-digit', minute = '2-digit', second = '2-digit', hour12 = false } = options;
  return new Intl.DateTimeFormat('en-US', {
    year,
    month,
    day,
    hour,
    minute,
    second,
    hour12,
  }).format(date);
};

export const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const diffInHours = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60));
};

export const isPast = (date) => {
  return new Date() > new Date(date);
};

export const startOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};
```