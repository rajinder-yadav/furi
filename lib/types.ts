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
import { Socket } from "node:net";

import { ApplicationContext } from './application-context.ts';
import { Furi } from './furi.ts';

/**
 * API Version.
 */
export const API_VERSION: string = '0.2.0';

/**
 * Logging helper functions.
 */
export const LOG_DEBUG = (...s: string[]) => console.debug('DEBUG> ', ...s);
export const LOG_INFO = (...s: string[]) => console.info('INFO> ', ...s);
export const LOG_LOG = (...s: string[]) => console.log('LOG> ', ...s);
export const LOG_WARN = (...s: string[]) => console.warn('WARNING> ', ...s);
export const LOG_ERROR = (...s: string[]) => console.error('ERROR> ', ...s);

export type LoggerMode = 'buffered' | 'streaming';

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
export type HandlerFunction = (ctx: ApplicationContext, next: () => void) => any;

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
 *
 * The key for staticRouteMap will be a path string.
 * The key for namedRoutePartitionMap will be the bucket value, which is a count of path segements.
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
 * Log level string litaral values for log messages and configuration.
 */
export const LogLevels = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  LOG: 'LOG',
  WARN: 'WARN',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
  FATAL: 'FATAL'
};

/**
 * Log level ordinal values use for filtering log messages.
 */
export const LogLevelsRank = {
  DEBUG: 0,
  INFO: 1,
  LOG: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5,
  FATAL: 6
};

/**
 * Converts a log level string to its ordinal value to help with log filtering.
 *
 * @param logLevel - The log level as a string.
 * @returns Log level ordinal value.
 */
export function mapToLogLevelRank(logLevel: string): number {
  switch(logLevel.toUpperCase()) {
    case 'DEBUG':
      return LogLevelsRank.DEBUG;
    case 'INFO':
      return LogLevelsRank.INFO;
    case 'LOG':
      return LogLevelsRank.LOG;
    case 'WARN':
      return LogLevelsRank.WARN;
    case 'ERROR':
      return LogLevelsRank.ERROR;
    case 'CRITICAL':
      return LogLevelsRank.CRITICAL;
    case 'FATAL':
      return LogLevelsRank.FATAL;
    default:
      throw new Error(`Invalid log level: ${logLevel}`);
  }
}

/**
 * HTTP Request object extending Node.js IncomingMessage.
 */
export class HttpRequest extends IncomingMessage {
  public params: MapOf<string | number> = {};
  public query: URLSearchParams | null = null;
  public sessionData: MapOf<any> = {};
  public app: Furi | null = null;

  constructor(incomingMessage: Socket);
  constructor(incomingMessage: IncomingMessage);
  constructor(incomingMessage: unknown) {
    super(incomingMessage instanceof IncomingMessage
      ? incomingMessage.socket :
      incomingMessage as Socket
    );
    if (incomingMessage instanceof IncomingMessage) {
      Object.assign(this, incomingMessage);
    }
  }
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
  server: {
  env: string;                    // Run-time environment (development, production).
  port: number;                   // Port server will listen for connection requests.
  host: string;                   // host server will listen for connection requests.
  callback: null | (() => void);  // Callback function that will be called when server is ready.
  },
  logger: {
    enabled: boolean;             // Enable logging of requests and responses.
    flushPeriod: number;          // Period in milliseconds between log flushes.
    logFile: string;              // Path to log file, if logging mode is 'stream'.
    maxCount: number;             // Maximum number of log entries before flushing.
    mode: LoggerMode;             // Log mode, buffered or stream.
    level: string;                // Log level, debug, info, warn, error.
  };
}

/**
 * Base class for Class based router handlers.
 */
export abstract class BaseRouterHandler {
  abstract handle(ctx: ApplicationContext, next: () => void): any;
}

/**
 * Generic Constructor function.
 */
export type RouterHanderConstructor<T> = {
  new(...args: any[]): T;
};

/**
 * Router reuqest handler definition.
 */
export type Route = {
  path: string;
  method: string;
  controller: HandlerFunction | HandlerFunction[] | RouterHanderConstructor<BaseRouterHandler>;
};

/**
 * Router configuration.
 */
export type RouterConfig = {
  middleware?: HandlerFunction[];
  routes?: Route[];
};
/**
 * Export type alias for Routes to be used by developers.
 */
export type Routes = RouterConfig;

/**
 * Helper function to check type Routes.
 * Properties 'middleware' or 'routes' are optional, but not both.
 */
export function isTypeRouterConfig(value: unknown): value is RouterConfig {
  const middleswares: boolean = typeof value === 'object'
    && value !== null
    && 'middleware' in value
    && Array.isArray(value.middleware);

  const routes: boolean = typeof value === 'object'
    && value !== null
    && 'routes' in value
    && Array.isArray(value.routes)

  return middleswares || routes;
}
