import type { Seminar } from './types';

const READING_SEMINAR_DISPLAY_PRIORITY = 100;

function displayPriority(seminar: Pick<Seminar, 'type'>): number {
  return seminar.type === 'rinudoku' ? READING_SEMINAR_DISPLAY_PRIORITY : 0;
}

export function compareSeminarsWithinDay(a: Seminar, b: Seminar): number {
  const priorityCompare = displayPriority(a) - displayPriority(b);
  if (priorityCompare !== 0) return priorityCompare;

  const timeCompare = (a.start_time || '99:99').localeCompare(b.start_time || '99:99');
  if (timeCompare !== 0) return timeCompare;

  return (a.title || '').localeCompare(b.title || '', 'ja');
}

export function compareSeminars(a: Seminar, b: Seminar): number {
  const dateCompare = a.date.localeCompare(b.date);
  if (dateCompare !== 0) return dateCompare;

  return compareSeminarsWithinDay(a, b);
}
