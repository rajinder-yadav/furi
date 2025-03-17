/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// deno-lint-ignore-file no-explicit-any
import { IncomingMessage, ServerResponse, } from 'node:http';
import { Socket } from "node:net";

import { ApplicationContext } from './application-context.ts';
import { Furi } from './furi.ts';

/**
 * API Version.
 */
export const API_VERSION: string = '0.8.0';

/**
 * Logging helper functions.
 */
export const LOG_DEBUG = (msg: string) => { if (Furi.fastLogger) { Furi.fastLogger.debug(msg); } }
export const LOG_INFO = (msg: string) => { if (Furi.fastLogger) { Furi.fastLogger.info(msg); } }
export const LOG_LOG = (msg: string) => { if (Furi.fastLogger) { Furi.fastLogger.log(msg); } }
export const LOG_WARN = (msg: string) => { if (Furi.fastLogger) { Furi.fastLogger.warm(msg); } }
export const LOG_ERROR = (msg: string) => { if (Furi.fastLogger) { Furi.fastLogger.error(msg); } }

export type LoggerMode = 'buffer' | 'stream';

/**
 * Map types for different indexed access.
 */
export interface MapOf<T1> {
  [key: string]: T1;
}

/**
 * Query parameter types.
 */
export type QueryParamTypes = string | string[] | number;

/**
 * Middleware function signature..
 */
export type NextHandler = () => void;

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
export type ContextHandler = (ctx: ApplicationContext, next: NextHandler) => any;

/**
 * Static route handler callback functions.
 */
export interface StaticRouteCallback {
  callbacks: ContextHandler[]; // Handler callback functions for associated URI.
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
  useRegex: boolean;           // Use regex for path matching.
  pathNames: string[];         // Path segment names.
  key: string;                 // RegEx URI string.
  params: string[];            // URI named segments.
  callbacks: ContextHandler[]; // Handler callback functions for associated URI.
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
  DELETE: 5,
  OPTIONS: 6,
  HEAD: 7,
}

/**
 * Log level string litaral values for log messages and configuration.
 */
export const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  LOG: 'LOG',
  WARN: 'WARN',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
  FATAL: 'FATAL',
};

/**
 * Log level ordinal values use for filtering log messages.
 */
export const LogLevelOrdinal = {
  DEBUG: 0,
  INFO: 1,
  LOG: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5,
  FATAL: 6,
};

/**
 * Converts a log level string to its ordinal value to help with log filtering.
 *
 * @param logLevel - The log level as a string.
 * @returns Log level ordinal value.
 */
export function mapToLogLevelRank(logLevel: string): number {
  switch (logLevel.toUpperCase()) {
    case 'DEBUG':
      return LogLevelOrdinal.DEBUG;
    case 'INFO':
      return LogLevelOrdinal.INFO;
    case 'LOG':
      return LogLevelOrdinal.LOG;
    case 'WARN':
      return LogLevelOrdinal.WARN;
    case 'ERROR':
      return LogLevelOrdinal.ERROR;
    case 'CRITICAL':
      return LogLevelOrdinal.CRITICAL;
    case 'FATAL':
      return LogLevelOrdinal.FATAL;
    default:
      LOG_ERROR(`mapToLogLevelRank Invalid log level: ${logLevel}, defaulting to LOG level.`);
      return LogLevelOrdinal.LOG;
  }
}

/**
 * HTTP Request object extending Node.js IncomingMessage.
 */
export class FuriRequest extends IncomingMessage {
  public params: MapOf<string | number> = {};
  public query: URLSearchParams | null = null;
  public sessionData: MapOf<any> = {};
  public app: Furi | null = null;
  public body: any = null;

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
export class FuriResponse extends ServerResponse<IncomingMessage> {
}

/**
 * Furi Server Configuration properties.
 * The properties are assigned default values, but can be overridden,
 * either from code or environment variables, or a '.env' file.
 */
export interface FuriConfig {
  server: {
    env: string;                    // Run-time environment (development, production).
    port: number;                   // Port server will listen for connection requests.
    host: string;                   // host server will listen for connection requests.
    callback: null | (() => void);  // Callback function that will be called when server is ready.
    secure: boolean;                // Readonly flag, true indicates secure connections (HTTPS).
  },
  logger: {
    enabled: boolean;             // Enable file logging.
    terminal: boolean;            // Enable terminal logging.
    flushPeriod: number;          // Period in milliseconds between log flushes.
    logFile: string;              // Path to log file, if logging mode is "stream".
    maxCount: number;             // Maximum number of log entries before flushing.
    mode: LoggerMode;             // Log mode, "buffer" or "stream".
    level: string;                // Log level, debug, info, warn, error.
  },
  cert?: {
    key: string;                    // Path to SSL key file.
    cert: string;                   // Path to SSL certificate file.
    ca?: string | string[];         // Path to CA certificate file, if required for SSL key.
    passphrase?: string;            // Passphrase for SSL key file.
    rejectUnauthorized?: boolean;   // Reject unauthorized SSL connections.
    requestCert?: boolean;          // Require SSL client certificate.
  },
}

/**
 * Base class for Class based router handlers.
 */
export abstract class BaseRouterHandler {
  abstract handle(ctx: ApplicationContext, next: NextHandler): any;
}

/**
 * Generic Constructor function.
 */
export type RouterHanderConstructor<T> = {
  new(...args: any[]): T;
};

/**
 * Router request handler definition.
 */
export type Route = {
  path: string;
  method: string;
  controller: ContextHandler | ContextHandler[] | RouterHanderConstructor<BaseRouterHandler>;
};

/**
 * Router configuration.
 */
export type RouterConfig = {
  middleware?: ContextHandler[];
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

/**
 * Create an instance of the class and return bound handler function.
 *
 * @param ClassRef
 * @returns handler function bound to instace of the class.
 */
export function ClassHandler(ClassRef: unknown): ContextHandler | null {
  if (ClassRef && typeof ClassRef === 'function' && ClassRef.prototype instanceof BaseRouterHandler) {
    const ClassRouterHandlerRef: RouterHanderConstructor<BaseRouterHandler> = ClassRef as RouterHanderConstructor<BaseRouterHandler>;
    const instanceRef = new ClassRouterHandlerRef();
    return instanceRef.handle.bind(instanceRef);
  }
  LOG_ERROR("Invalid class reference. Please provide a valid class that extends BaseRouterHandler.");
  return null;
}
