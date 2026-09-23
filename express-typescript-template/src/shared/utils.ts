import slug from "slugify";
import moment from "moment";
// I used nano id in order to create an small unique id for join codes
// https://www.npmjs.com/package/nanoid
import { customAlphabet } from "nanoid";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const error_codes = require("./postgresql-error-codes");

/**
 * NOTE: Utility functions naming conversion is snake-case
 */

/**
 * Log errors
 * @param error any
 */
export function log_error(error: any) {
  const msg = error_codes[error.code];
  if (msg) {
    console.trace(`ERROR [${error.code}]: ${msg}`);
  } else {
    console.error(error);
  }
}

/**
 * String value to a URL-friendly string
 * @param str {String}
 * @returns string
 */
export function slugify(str: string): string {
  return slug(str, {
    replacement: "-",    // replace spaces with replacement
    remove: /[\/()._]/g,        // regex to remove characters
    lower: true,         // result in lower case
  });
}

// https://stackoverflow.com/a/13627586/14417945
export function ordinal_suffix_of(i: number) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return `${i}st`;
  }
  if (j == 2 && k != 12) {
    return `${i}nd`;
  }
  if (j == 3 && k != 13) {
    return `${i}rd`;
  }
  return `${i}th`;
}

/**
 * Return humanized duration string between the start and end
 * @example 15 minutes, 1 hour
 * @param startDate {string}
 * @param endDate {string}
 * @returns string
 */
export function get_duration(startDate: string, endDate: string): string {
  const start = moment(startDate);
  const end = moment(endDate);
  const diff = end.diff(start);
  return moment.duration(diff).humanize();
}

export function create_join_code(len: number) {
  /**
   * Create nanoid instance with a specific alphabet
   * `Alphabet: 0123456789`
   * @returns e.g. 458652
   */
  return customAlphabet("0123456789", len)();
}
