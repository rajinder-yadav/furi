/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016 - 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// deno-lint-ignore-file no-explicit-any
import { Furi } from './furi'
import { GlobalStore } from './global-store';
import {
  FuriRequest,
  FuriResponse,
  MapOf,
  QueryParamTypes,
  // LOG_DEBUG,
  // LOG_ERROR,
  // LOG_WARN,
} from './types';


/**
 * An initialized Application Context object is passed to
 * each middleware and request handler. It provides helper
 * functions to simplify working with Request and Response objects.
 * It also helps manage application state and session state.
 */
export class ApplicationContext {
  /**
   * asyncResponseTimerId
   *
   * This flag determines whether the application or middleware is running in async operation.
   * If non-null, then do not close the response prematurely in the router.
   *
   * For the middleware, call startAsyncResponseTimer(timeoutInMillisecond) when an asynchrouous operation is started..
   *
   * TODO: Maybe add a timeout for async operations?
   */
  asyncResponseTimerId: NodeJS.Timeout | null = null;

  constructor(
    public appStore: GlobalStore,
    public request: FuriRequest,
    public response: FuriResponse
  ) {
    // Init request session data.
    this.request.sessionData = {};
  }

  /**
   * Starts a one-shot timer to to close the reponse with a HTTP 408 error.
   * This is useful for middleware that performs an asynchronous operation
   * and needs to ensure the response is not prematurely closed, or hangs.
   *
   * @param timeout in milliseconds.
   * @returns None.
   */
  startAsyncResponseTimer(timeout?: number): void {
    if (this.asyncResponseTimerId) { return; }

    // Default to 1.5 seconds if no value is provided.
    const timeoutValue = timeout || 1500;
    // LOG_DEBUG(`ApplicationContext::startAsyncResponseTimer starting async response timer for ${timeoutValue} ms.`);

    this.asyncResponseTimerId = setTimeout(() => {
      this.asyncResponseTimerId = null;
      if (this.response.writable) {
        this.response.writeHead(408, {
          'Content-Type': 'text/plain',
          'User-Agent': Furi.getApiVersion(),
        });
        this.response.end('Response timed out. Please try again later.');
        // LOG_DEBUG(`ApplicationContext::startAsyncResponseTimer Middlesware async operation timed out after ${timeoutValue} ms. Closed response.`);
      }
    }, timeoutValue);
  }

  /**
   * Stop and clear the async response timer. Make this
   * call when the async operation is complete to prevent
   * indeterminate response behavior.
   */
  stopAsyncResponseTimer(): void {
    // LOG_DEBUG(`ApplicationContext::stopAsyncResponseTimer called.`);
    if (this.asyncResponseTimerId) {
      clearTimeout(this.asyncResponseTimerId);
      this.asyncResponseTimerId = null;
      // LOG_DEBUG(`ApplicationContext::stopAsyncResponseTimer cleared async response timer.`);
    }
  }

  /**
   * Parse query string into an object.
   *
   * @param ctx:    Application context object.
   * @param simple  true will parse all values as a string,
   *                false will parse a value as a string or number.
   * @returns Parsed query string as an object, or null if no valid query parameters are found.
   */
  queryStringToObject(simple: boolean = true): MapOf<QueryParamTypes> | null {

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
    if (arguments.length === 2) {
      this.request.sessionData[key] = value;
    } else {
      return this.request.sessionData[key];
    }
  }
  /**
   * Global Application state.
   * Overloaded helper functions to read or set application state.
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
    if (arguments.length === 2) {
      this.appStore.storeState(key, value);
    } else {
      return this.appStore.storeState(key);
    }
  }

  /**
   * Helper function to delete an entry from the store state.
   *
   * @param key The key of the entry to delete.
   */
  storeStateDelete(key: string): void {
    this.appStore.storeStateDelete(key);
  }

  /**
   * Helper function to reset the store state.
   * This call will delete all entries in the store state.
   */
  storeStateReset(): any {
    this.appStore.storeStateReset()
  }

  /**
   * Fetch cookie from request header.
   *
   * @return Cookie value or undefined if not found.
   */
  getCookie(): string | string[] | undefined {
    return this.request.headers ? this.request.headers['cookie'] : undefined;
  }

  /**
   * Set cookies in response header. This function may be called
   * multiple times to set multiple cookies.
   *
   * @param name Cookie name.
   * @param value Cookie value.
   * @return void.
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
    if (arguments.length === 2) {
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

  /**
   * Overloaded method to send response data, default encoding is 'utf8'.
   * Support send both text or object input and will convert to JSON if data is an object.
   *
   * @param data     The response data, can be a string or an object.
   * @param encoding The encoding of the response data, default is 'utf8'.
   * @return void.
   */
  send(data: string, encoding?: NodeJS.BufferEncoding): void;
  send(data: object, encoding?: NodeJS.BufferEncoding): void;
  send(data: unknown, encoding?: NodeJS.BufferEncoding): void {
    const bufferEncoding = encoding ?? 'utf8';
    if (typeof data === 'string') {
      this.response.write(data, bufferEncoding);
    } else {
      this.response.write(JSON.stringify(data), bufferEncoding);
    }
  }

  /**
   * Overloaded method to optionally send response data, and then close the connection.
   * Support send both text or object input and will convert to JSON if data is an object.
   * The default encoding is 'utf8'.
   *
   * @param data     The response data, can be a string or an object, or empty.
   * @param encoding The encoding of the response data, default is 'utf8'.
   * @return void.
   */
  end(): void;
  end(data: string): void;
  end(data: object): void;
  end(data?: unknown): void {
    if (arguments.length === 0) {
      this.response.end();
    } else if (typeof data === 'string') {
      this.response.end(data);
    } else {
      this.response.end(JSON.stringify(data));
    }
  }

  /**
   * Cause a retirect to another URL with an optional HTTP status code.
   * Default is 302 (Found).
   *
   * @param url The URL to redirect to.
   * @param status The HTTP status code for the redirect.
   * @return void.
   */
  redirect(url: string, status?: number): void {
    const statusCode = status ?? 302;
    this.response.writeHead(statusCode, { Location: url });
    this.response.end();
  }

};
