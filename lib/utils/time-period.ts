/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016 - 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

/**
 * Time period options for setting cookie expiration.
 */
export type TimeOptions = {
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
};

/**
 * Time calculation utility class.
 * Time is Linux UCT in milliseconds, defined as the
 * midnight at the beginning of January 1, 1970, UTC.
 */
export class TimePeriod {

  /**
   * Calculate a future date from now based on the provided time options.
   *
   * @param options Object with time properties.
   * @returns String value of Date in the future.
   */
  static expiresUTC(options: TimeOptions): string {
    const expires = new Date(Date.now() + TimePeriod.expires(options));
    return expires.toUTCString();
  }

  /**
   * Calculate time value in milliseconds using the time options.
   *
   * @param options - Object with time properties.
   * @returns Time value in milliseconds.
   */
  static expires(options: TimeOptions): number {
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let time = 0;

    if (options.minutes) {
      time += options.minutes * minute;
    }
    if (options.hours) {
      time += options.hours * hour;
    }
    if (options.days) {
      time += options.days * day;
    }
    if (options.weeks) {
      time += options.weeks * week;
    }
    if (options.months) {
      time += options.months * month;
    }
    if (options.years) {
      time += options.years * year;
    }
    return time;
  }
}
