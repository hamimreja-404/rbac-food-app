/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} country  'India' | 'America'
 */
export const formatCurrency = (amount, country = 'India') => {
  if (country === 'America') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Role badge colors */
export const roleBadgeClass = {
  admin:   'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100   text-blue-700',
  member:  'bg-green-100  text-green-700',
};

/** Status pill colors */
export const statusClass = {
  pending:   'bg-yellow-100 text-yellow-700',
  placed:    'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-700',
};

/** Capitalise first letter */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/** Truncate text */
export const truncate = (str = '', max = 60) =>
  str.length > max ? str.slice(0, max) + '…' : str;

/** Generate a placeholder restaurant image from picsum */
export const restaurantPlaceholder = (id) =>
  `https://picsum.photos/seed/resto-${id}/600/400`;

/** Generate a placeholder food image */
export const foodPlaceholder = (name) =>
  `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`;
