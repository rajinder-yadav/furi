/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { IncomingMessage, ServerResponse, } from 'node:http';

import { ApplicationContext } from './application-context.ts';
import { Furi } from './furi.ts';

/**
 * API Version.
 */
export const API_VERSION: string = '0.1.0';

/**
 * Logging helper functions.
 */
export const LOG_DEBUG = (...s: string[]) => console.debug('DEBUG> ', ...s);
export const LOG_INFO = (...s: string[]) => console.info('DEBUG> ', ...s);
export const LOG_WARN = (...s: string[]) => console.warn('WARNING> ', ...s);
export const LOG_ERROR = (...s: string[]) => console.error('ERROR> ', ...s);

/**
 * Map types for different indexed access.
 */
export interface MapOf<T1> {
  [key: string]: T1;
}

export type QueryParamTypes = string | string[] | number;

/**
 * Function prototype for Request Handler callback function.
 *
 * @param request: HttpRequest
 * @param response: HttpResponse
 * @return boolean | void - return false to cancel remaining handlers.
 *
 * When multiple request handlers are passed in as an array,
 * any one may return false to prevent the remaining handlers from getting executed.
 */
export type HandlerFunction = (ctx: ApplicationContext) => boolean | void;

/**
 * Static route handler callback functions.
 */
export interface StaticRouteCallback {
  callbacks: HandlerFunction[]; // Handler callback functions for associated URI.
}

/**
 * Named route handler callback functions.
 * The 'key' is a regex string, with grouping for named segments.
 * the 'pathNames' is used by  the fast match algorithm, when useRegex is false,
 * otherwise the 'key' is use to determine if a route matches.
 *
 * @see createNamedRouteSearchKey for details on how 'key' is created.
 * @see attachPathParamsToRequestIfExists for details on how 'params' is created.
 * @see fastPathMatch for how the path is matched against 'pathNames'.
 */
export interface NamedRouteCallback {
  useRegex: boolean;            // Use regex for path matching.
  pathNames: string[];          // Path segment names.
  key: string;                  // RegEx URI string.
  params: string[];             // URI named segments.
  callbacks: HandlerFunction[]; // Handler callback functions for associated URI.
}

/**
 * Maps URI to named params and handler callback functions.
 *
 * Matching Rules:
 * For URI direct matches, the callbacks will be found in uri_map.
 * For URI with named segments, the callbacks will be found under named_param.
 */
export interface RouteMap {
  staticRouteMap: MapOf<StaticRouteCallback>;
  namedRoutePartitionMap: MapOf<NamedRouteCallback[]>;
}

/**
 * Enumerated keys for HTTP Maps. The keys are used to partition
 * HTTP methods, to optimized lookup.
 */
export const HttpMapIndex = {
  MIDDLEWARE: 0,
  GET: 1,
  POST: 2,
  PUT: 3,
  PATCH: 4,
  DELETE: 5
}

/**
 * HTTP Request object extending Node.js IncomingMessage.
 */
export class HttpRequest extends IncomingMessage {
  public params: MapOf<string | number> = {};
  public query: URLSearchParams | null = null;
  public sessionData: MapOf<any> = {};
  public app: Furi | null = null;
}

/**
 * HTTP Response object extending Node.js ServerResponse.
 */
export class HttpResponse extends ServerResponse<IncomingMessage> {
}

/**
 * FURI Server Configuration properties.
 * The properties are assigned default values, but can be overridden,
 * either from code or environment variables, or a '.env' file.
 */
export interface FuriConfig {
  env?: string;                   // Run-time environment (development, production).
  port?: number;                  // Port server will listen for connection requests.
  host?: string;                  // host server will listen for connection requests.
  callback?: null | (() => void); // Callback function that will be called when server is ready.
}
