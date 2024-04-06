export const formatDateToLocal = (
  date: Date,
  locale: string = 'en-US',
) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/**
 * Return midnight on the first day of the given week in a year.
 * This is using the ISO 8601 week date system.
 * From https://stackoverflow.com/a/16354810.
 * @param week
 * @param year
 * @returns
 */
export function firstDayOfWeek(week: number, year: number | null = null) {
  if (year == null) {
    year = new Date().getFullYear();
  }

  const date = firstWeekOfYear(year);
  const weekTime = weeksToMilliseconds(week);
  date.setTime(date.getTime() + weekTime);
  return date;
}

/**
 * Return midnight on the first week of a year.
 * This is not necessarily January 1st in the ISO 8601 week date system.
 * Based on https://stackoverflow.com/a/16354810.
 * @param year
 * @returns
 */
export function firstWeekOfYear(year: number) {
  let date = firstDayOfYear(year);
  date = firstWeekday(date);
  return date;
}

/**
 * Return midnight on the first day of a year.
 * Based on https://stackoverflow.com/a/16354810.
 */
export function firstDayOfYear(year: number) {
  return new Date(year, 0, 1, 0, 0, 0, 0);
}

/**
 * Return midnight on the first weekday of a year, given the first day in the year.
 * This is not necessarily January 1st in the ISO 8601 week date system.
 * From https://stackoverflow.com/a/16354810.
 */
function firstWeekday(firstOfJanuaryDate: Date) {
  // Zero corresponds to Sunday, and 6 corresponds to Saturday.
  // In ISO 8601, the first weekday is always Monday.
  const FIRST_WEEKDAY = 1;
  const DAYS_PER_WEEK = 7;
  // Get the day of the week (0-6, Sunday-Saturday).
  let day = firstOfJanuaryDate.getDay();
  // Make Monday-Sunday correspond to 1-7 instead of 0-6.
  day = day === 0 ? 7 : day;
  // `dayOffset` will correct the date in order to get a Monday.
  let dayOffset = -day + FIRST_WEEKDAY;
  if (DAYS_PER_WEEK - day + 1 < 4) {
    // If the current week doesn't have the minimum of 4 days required by ISO
    // 8601, add one week. This is how leap weeks are introduced.
    dayOffset += DAYS_PER_WEEK;
  }
  return new Date(
    firstOfJanuaryDate.getTime() + dayOffset * 24 * 60 * 60 * 1000,
  );
}

/**
 * Given a week number from 1 to 53, return the number of milliseconds from
 * the start of the year to the start of the week.
 * Based on https://stackoverflow.com/a/16354810.
 */
function weeksToMilliseconds(weeks: number) {
  return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
}

/**
 * Generate a random color based on `string`.
 * Based on https://stackoverflow.com/a/16348977.
 * @returns A 6-digit hex color code
 */
export function uniqueColorFromString(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; ++i) {
    const char = string.charCodeAt(i);
    hash = char + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const channel = (hash >> (i * 8)) & 255;
    color += channel.toString(16).padStart(2, '0');
  }
  return color;
}
