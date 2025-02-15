/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { Furi } from './furi.ts';
import { HttpRequest, HttpResponse } from './types.ts';

/**
 * An initialized Application Context object is passed to
 * each middleware and request handler. It provides helper
 * functions to simplify working with Request and Response objects.
 * It also helps manage application state and session state.
 */
export class ApplicationContext {

  constructor(
    public app: Furi,
    public request: HttpRequest,
    public response: HttpResponse
  ) {
    // Init request session data.
    this.request.sessionData = {};
  }

  /**
     * Parse query string into an object.
     * @param ctx:    Application context object.
     * @param simple  true will parse all values as a string,
     *                false will parse a value as a string or number.
     * @returns Parsed query string as an object, or null if no valid query parameters are found.
     */
  queryStringToObject(
    simple: boolean = true
  ): { [key: string]: string | string[] | number } | null {
    const queryParams: URLSearchParams | null = this.request?.query;
    const resultObj: { [key: string]: string | string[] | number } = {};
    queryParams?.forEach((v, k) => {
      const arr = v.split(',');
      if (simple) {
        // Params to Object with string values.
        resultObj[k] = arr.length > 1 ? arr : v;
      } else {
        // Params to Object with string or number values.
        const value = v !== '' ? Number(v) : NaN;
        resultObj[k] = arr.length > 1 ? arr : (isNaN(value) ? v : value);
      }
    });
    return resultObj
  }
  /**************************************
   * Application level helper functions.
   **************************************/

  /**
   * Request session state.
   * Overloaded functions to read or set application state.
   *
   * Read session data from the request object.
   * Set session data from the request object.
   * Session data is automatically reset between requests.
   *
   * @param key The session data key.
   * @param value The session data value.
   * @return Session data value or undefined if not found, when value is not provided.
  */
  sessionState(key: string): any;
  sessionState(key: string, value: any): void;
  sessionState(key: string, value?: any): any {
    if (value) {
      this.request.sessionData[key] = value;
    } else {
      return this.request.sessionData[key];
    }
  }
  /**
   * Global Application state.
   * Overloaded functions to read or set application state.
   *
   * Read application state data.
   * Set application state data.
   *
   * @param key The application state key.
   * @param value The application state value.
   * @return Application state value or undefined if not found, when value is not provided.
   */
  storeState(key: string): any;
  storeState(key: string, value: any): void;
  storeState(key: string, value?: any): any {
    if (value) {
      this.app.storeState(key, value);
    } else {
      return this.app.storeState(key);
    }
  }

  /**
   * Fetch cookie from request header.
   * @return Cookie value or undefined if not found.
   */
  getCookie(): string | string[] | undefined {
    return this.request.headers['cookie'];
  }

  /**
   * Set cookies in response header. This function may be called
   * multiple times to set multiple cookies.
   *
   * @param name Cookie name.
   * @param value Cookie value.
   */
  setCookie(name: string, value: string): void {
    const cookies = this.response.getHeader('Set-Cookie');
    if (!cookies) {
      this.response.setHeader('Set-Cookie', `${name}=${value};`);
    } else {
      this.response.setHeader('Set-Cookie', `${cookies} ${name}=${value};`);
    }
  }

  /**************************************
   * Request level helper functions.
  **************************************/

  /**
   * Overloaded functions to read or set request headers.
   *
   * @param name The header name.
   * @param value The header value.
   * @returns Current header value or undefined if not found, when value is not provided.
   */
  requestHeader(name: string): string | string[] | undefined;
  requestHeader(name: string, value: string): void;
  requestHeader(name: string, value?: string): any {
    if (value) {
      this.request.headers[name] = value;
    } else {
      return this.request.headers[name];
    }
  }
  requestHeaders(): any {
    return this.request.headers;
  }


  /**************************************
   * Response level helper functions.
   **************************************/

  /**
   * Overloaded functions to read or set response headers.
   *
   * @param headers The headers to set.
   * @param name The header name.
   * @param value {optional} The header value.
   * @return Current header value or undefined if not found, when value is not provided.
   */
  responseHeader(headers: Headers): void;
  responseHeader(name: string): string | string[] | undefined;
  responseHeader(name: string, value: string): void;
  responseHeader(): any {
    if (arguments[0] instanceof Headers) {
      this.response.setHeaders(arguments[0]);
    }
    else if (arguments.length === 1) {
      return this.response.getHeader(arguments[0] as string);
    } else if (arguments.length === 2) {
      this.response.setHeader(arguments[0] as string, arguments[1] as string);
    }
  }

  send(data: string, encoding: NodeJS.BufferEncoding): void;
  send(data: object, encoding: NodeJS.BufferEncoding): void;
  send(data: unknown, encoding: NodeJS.BufferEncoding = 'utf8'): void {
    if (typeof data === 'string') {
      this.response.write(data, encoding);
    } else {
      this.response.write(JSON.stringify(data), encoding);
    }
  }

  end(): void;
  end(data: string): void;
  end(data: object): void;
  end(data?: unknown): void {
    if (!data) {
      this.response.end();
    } else if (typeof data === 'string') {
      this.response.end(data);
    } else {
      this.response.end(JSON.stringify(data));
    }
  }

};
