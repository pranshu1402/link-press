/**
 * Miscellaneous shared functions go here.
 */

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

/**
 * Falsy value check for any type of value
 */
export const isEmpty = (objectToCheck: unknown) => {
  if (objectToCheck === null || objectToCheck === undefined) return true;
  if (Array.isArray(objectToCheck)) return !objectToCheck.length;
  if (typeof objectToCheck === 'string') return !objectToCheck.trim().length;

  if (objectToCheck instanceof Date)
    return objectToCheck.getTime && isNaN(objectToCheck.getTime());

  if (typeof objectToCheck === 'object')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.keys(objectToCheck).length === 0;
  if (typeof objectToCheck === 'number')
    return !objectToCheck && objectToCheck !== 0;
  return !objectToCheck;
};

export function getISODateStr(date: Date): string {
  if (!date) return '';
  return date.toISOString();
}

export function addDaysToDate(date: Date = new Date(), days: number = 7): Date {
  const newDate = new Date(date);
  const updatedTimeStamp = newDate.setDate(newDate.getDate() + days);
  return new Date(updatedTimeStamp);
}
