// Utility functions for className concatenation
// Enhanced to support objects for conditional classes (like clsx)
export function cn(...classes: Array<string | undefined | null | false | Record<string, boolean>>): string {
  return classes
    .flatMap(cls => {
      if (!cls) return [];
      if (typeof cls === 'string') return [cls];
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .join(' ');
}
export default cn;
