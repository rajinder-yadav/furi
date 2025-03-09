/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

/**
 * RFC: 6265 HTTP State Management Mechanism
 * https://datatracker.ietf.org/doc/html/rfc6265
 *
 *
 * MDN :https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 */

// deno-lint-ignore-file no-explicit-any
import { createHmac } from 'node:crypto';

import { ApplicationContext } from '../application-context.ts';
import { MapOf, LOG_ERROR, LOG_DEBUG, LOG_WARN } from '../types.ts';
import { TimePeriod } from './time-period.ts';

/**
 * Cookie defined types.
 */
type CookieTypes = string | number | boolean;
type CookieOptions = MapOf<CookieTypes>;
type CookieItem = { value: CookieTypes, signature?: string, options?: CookieOptions };
type Cookie = MapOf<CookieItem>;
type SameSiteValues = 'Strict' | 'Lax' | 'None';
/**
 * Cookie options.
 */
const CookieOptions = [
  // Standard case
  'Domain',
  'Expires',
  'HttpOnly',
  'Max-Age',
  'Path',
  'SameSite',
  'Secure',
  'sessionId',
  // Lower case
  'domain',
  'expires',
  'httponly',
  'max-age',
  'path',
  'samesite',
  'secure',
  'sessionid',
  //
  'firstPartyDomain',
  'firstpartydomain',
];

/**
 * HttpCookiesStore class for managing HTTP cookies.
 */
export class HttpCookiesStore {

  // Cookie store state.
  cookies: Cookie = {};

  /**
   * Clears cookie store.
   * Removes all cookies from the store.
   *
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  clear(): HttpCookiesStore {
    this.cookies = {};
    return this;
  }

  /**
   * Set cookine to expire immediately.
   * This will tell the web browser to delete the cookie.
   *
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  delete(name: string): HttpCookiesStore {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::delete Cookie ${name} does not exist`);
      return this;
    }
    this.cookies[name].options!['Max-Age'] = 0;
    return this;
  }

  /**
   * Overloaded function to get and set cookie expires
   *
   * @param value - Numerical value in milliseconds.
   * @param value - String representing the Date value in UTC.
   * @param value - TimeOptions object.
   * @returns - Current expiration date of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  expires(name: string, value?: number): any;
  expires(name: string, value?: string): any;
  expires(name: string, value?: object): any;
  expires(name: string, value?: unknown): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::expires Cookie ${name} does not exist`);
      return this;
    }
    if (value === undefined) {
      return this.cookies[name].options!['Expires'] as string;
    } else if (typeof value === 'number') {
      this.cookies[name].options!['Expires'] = new Date(value).toUTCString();
    } else if (typeof value === 'string') {
      this.cookies[name].options!['Expires'] = value;
    } else if (typeof value === 'object' && value) {
      this.cookies[name].options!['Expires'] = TimePeriod.expiresUTC(value as TimePeriod);
    } else {
      LOG_ERROR('HttpCookiesStore::expires Invalid value passed as argument for expires.');
    }
    return this;
  }

  /**
   * Overloaded function to get and set Max-Age cookie option.
   *
   * @param name  Cookie name.
   * @param value Time value in Linux UCT time format.
   * @returns - Max-Age cookie option.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  maxAge(name: string, value?: number): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::maxAge Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['Max-Age'] = value;
    } else {
      return this.cookies[name].options!['Max-Age'];
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie domain.
   *
   * @param value - String representing the domain.
   * @returns - Current domain of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // domain(value?: string): string | HttpCookiesStore | undefined {
  domain(name: string, value?: string): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::domain Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['Domain'] = value;
    } else {
      return this.cookies[name].options!['Domain'] as string;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie first party domain.
   *
   * @param value - String representing the first party domain.
   * @returns - Current first party domain of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // firstPartyDomain(value?: string): string | HttpCookiesStore | undefined {
  firstPartyDomain(name: string, value?: string): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::firstPartyDomain Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['firstPartyDomain'] = value;
    } else {
      return this.cookies[name].options!['firstPartyDomain'] as string;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie httpOnly flag.
   *
   * @param value - Boolean representing the httpOnly flag.
   * @returns - Current httpOnly flag of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // httpOnly(value?: boolean): boolean | HttpCookiesStore | undefined {
  httpOnly(name: string, value?: boolean): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::httpOnly Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['HttpOnly'] = value;
    } else {
      return this.cookies[name].options!['HttpOnly'] as boolean;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie path.
   *
   * @param value - String representing the path of the cookie.
   * @returns - Current path of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // path(value?: string): string | HttpCookiesStore | undefined {
  path(name: string, value?: string): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::path Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['Path'] = value;
    } else {
      return this.cookies[name].options!['Path'] as string;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie secure flag.
   *
   * @param value - Boolean representing the secure flag.
   * @returns - Current secure flag of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // secure(value?: boolean): boolean | HttpCookiesStore | undefined {
  secure(name: string, value?: boolean): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::secure Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['Secure'] = value;
    } else {
      return this.cookies[name].options!['Secure'] as boolean;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie session flag.
   *
   * @param value - Boolean representing the session flag.
   * @returns - Current session flag of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // session(value?: boolean): boolean | HttpCookiesStore | undefined {
  // TODO! Learn more about Session flag.
  session(name: string, value?: string): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::session Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      this.cookies[name].options!['sessionId'] = value;
    } else {
      return this.cookies[name].options!['sessionId'] as boolean;
    }
    return this;
  }

  /**
   * Overloaded function to get and set cookie SameSite flag.
   *
   * @param value - String representing the SameSite flag.
   * @return - Current SameSite flag of the cookie or undefined.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  // sameSite(value?: string): string | HttpCookiesStore | undefined {
  sameSite(name: string, value?: SameSiteValues): any {
    if (!this.cookies[name]) {
      LOG_ERROR(`HttpCookiesStore::sameSite Cookie ${name} does not exist`);
      return this;
    }
    if (value) {
      if (this.isSiteValue(value)) {
        this.cookies[name].options!['SameSite'] = value;
      } else {
        LOG_ERROR('HttpCookiesStore::SameSite: Invalid SameSite flag. Must be one of "Strict", "Lax", or "None".');
      }
    } else {
      return this.cookies[name].options!['SameSite'] as string;
    }
    return this;
  }

  // TODO: Implement storeId method
  // storeId(): string | undefined;
  // storeId(value?: string): string | undefined {
  //   if (value) {
  //     this.cookies['storeId'] = value;
  //   } else {
  //     return this.cookies['storeId'] as string;
  //   }
  // }

  /**
   * Overloaded function to get and set cookie value.
   *
   * @param name - Name of the cookie.
   * @return - Value of the cookie or undefined if not found.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  cookie(name: string, value?: CookieTypes, options?: CookieOptions): any {
    if (value && options) {
      if (options['SameSite'] && !this.isSiteValue(options['SameSite'] as SameSiteValues)) {
        LOG_ERROR(`HttpCookiesStore::cookie cookies ${name} does not exist`);
      }
      this.cookies[name] = { value, options };
    }
    else if (value) {
      this.cookies[name] = { value, options: {} };
    }
    else if (this.cookies[name]) {
      return this.cookies[name].value;
    }
    else {
      LOG_ERROR(`HttpCookiesStore::cookie cookies ${name} does not exist`);
    }
    return this;
  }

  /**
   * Generate cookie string for header from cookie store.
   *
   * @returns - Cookie string for header.
   */
  generateCookieString(name: string): string | null {
    if (!this.cookies[name]) {
      LOG_ERROR('HttpCookieStore::generateCookieString cooke ${name} does not exist');
      return null;
    }

    const keys = ['HttpOnly', 'Secure']

    const signature = this.cookies[name].signature;
    let cookieString = signature ? `${name}=${encodeURIComponent(this.cookies[name].value)}.${signature}` : `${name}=${encodeURIComponent(this.cookies[name].value)}`;
    if (!this.cookies[name].options) {
      return cookieString;
    }

    for (const [option, value] of Object.entries(this.cookies[name].options)) {
      if (keys.includes(option)) {
        cookieString = `${cookieString}; ${option}`;
      } else {
        cookieString = `${cookieString}; ${option}=${encodeURIComponent(value)}`;
      }
    }
    return cookieString;
  }

  /**
   * Generate cookie headers from the cookie store.
   * The cookies array will be assigned to the outgoing response headers.
   *
   * @returns - Array of cookie strings.
   */
  generateCookieHeaders(): string[] {
    const cookies: string[] = [];
    Object.keys(this.cookies).forEach(name => {
      const cookie = this.generateCookieString(name);
      if (cookie) {
        cookies.push(cookie);
      }
    });
    return cookies;
  }

  /**
   * Parse cookies from a string and save them in the cookie store.
   *
   * @param cookie - String containing cookies.
   * @returns - None.
   */
  parseCookies(cookie: string | undefined): void {
    if (!cookie) {
      LOG_WARN('HttpCookieStore::parseCookies No cookies found');
      return;
    }
    let cookieName: string | null = null;
    const resultCookie: CookieItem = { value: '' };

    cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (CookieOptions.includes(name)) {
        const cookieValue = decodeURIComponent(value ?? true);
        if (resultCookie.options) {
          resultCookie.options[name] = cookieValue;
        } else {
          resultCookie.options = { [name]: cookieValue };
        }
      } else {
        if (cookieName) {
          LOG_ERROR(`HttpCookiesStore::parseCookies invalid cookie: ${cookie}`);
        }
        const [cookieValue, signature] = value.split('.');
        cookieName = name;
        resultCookie.value = decodeURIComponent(cookieValue);
        if (signature) {
          resultCookie.signature = signature;
        }
      }
    });

    if (
      resultCookie.options &&
      resultCookie.options['SameSite'] &&
      !this.isSiteValue(resultCookie.options['SameSite'] as SameSiteValues)
    ) {
      LOG_ERROR(`HttpCookiesStore::cookie cookies ${cookie} does not exist`);
    }

    if (cookieName) {
      this.cookies[cookieName] = resultCookie;
    } else {
      LOG_ERROR(`HttpCookiesStore::parseCookies is missed a cookie name: ${cookie}`);
    }

    // LOG_DEBUG(`HttpCookiesStore::parseCookies ${JSON.stringify(this.cookies)}`);
  }

  /**
   * Parse cookie from incoming request and saves them in the cookie store.
   *
   * @param ctx - Application context.
   */
  parseRequestCookie(ctx: ApplicationContext): void {
    this.parseCookies(ctx.request.headers.cookie);
  }

  /**
   * Set the response header with all cookies in the store.
   */
  setCookies(ctx: ApplicationContext): void {
    ctx.response.setHeader('Set-Cookie', this.generateCookieHeaders())
  }

  /**
   * Signed named cookie in the Cookie store.
   * @param name   Cookie name.
   * @param secret String value.
   * @returns - Current this reference to HttpCookiesStore instance.
   */
  sign(name: string, secret: string): HttpCookiesStore {
    if (this.cookies[name]) {
      this.cookies[name].signature = this.signCookie(`${name}=${this.cookies[name].value}`, secret);
    } else {
      LOG_ERROR('HttpCookiesStore::sign Cookie ${name} does not exist.')
    }
    return this;
  }

  /**
   * Verify signed named cookie in the Cookie store.
   *
   * @param name   Cookie name.
   * @param secret String value.
   * @returns true if signed and valid, otherwise false.
   */
  verify(name: string, secret: string): boolean {
    if (this.cookies[name]) {
      if (this.cookies[name].signature) {
        return this.verifyCookie(`${name}=${this.cookies[name].value}`, this.cookies[name].signature, secret);
      } else {
        LOG_WARN('HttpCookiesStore::sign Cookie ${name} is not signed.')
      }
    } else {
      LOG_ERROR('HttpCookiesStore::sign Cookie ${name} does not exist.')
    }
    return false;
  }

  /**
   * Sign cookie with the provided secret.
   * @param value  Cookie name, value pair.
   * @param secret String value.
   * @returns signed value.
   */
  signCookie(value: string, secret: string): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(value);
    return hmac.digest('hex');
  }

  /**
   * Verify signed cookie with the provided secret.
   * @param value     Cookie name, value pair.
   * @param signature Signed cookie signature.
   * @param secret    String value.
   * @returns true if valid, false otherwise.
   */
  verifyCookie(value: string, signature: string, secret: string): boolean {
    if (!signature) {
      return false;
    }
    const expectedSignature = this.signCookie(value, secret);
    return signature === expectedSignature;
  }

  // Type guard function to check if a string is one of the SiteValues
  isSiteValue(value: SameSiteValues): value is SameSiteValues {
    return ['Lax', 'Strict', 'None'].includes(value);
  }

}
