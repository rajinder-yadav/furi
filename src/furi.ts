/**
 * FURI - Fast Uniform Resource Identifier.
*
* The Fast and Furious Node Router.
* Copyright(c) 2016 Rajinder Yadav.
*
* Labs DevMentor.org Corp. <info@devmentor.org>
* This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
*/

// deno-lint-ignore-file no-process-globals ban-types no-explicit-any no-unused-vars
import * as http from "node:http";
import {
  IncomingMessage,
  ServerResponse,
  Server,
} from "node:http";

/**
 * API Version.
 */
const API_VERSION: string = "0.1.0";

// Debug logging - comment our for production builds.
const LOG_DEBUG = (...s: string[]) => console.debug("DEBUG> ", ...s);
const LOG_INFO = (...s: string[]) => console.info("DEBUG> ", ...s);
const LOG_WARN = (...s: string[]) => console.warn("WARNING> ", ...s);
const LOG_ERROR = (...s: string[]) => console.error("ERROR> ", ...s);

type MapOfString = { [key: string]: string };
type MapOfStringNumber = { [key: string]: string | number };
type MapOfANY = { [key: string]: any }
type MapOfRequestHandler = { [key: string]: RequestHandler };
type MapOfNamedRouteParam = { [key: string]: NamedRouteParam[] };

// Type definitions for request and response objects.
// Obtained from http.d.ts
//
// type Request  = typeof IncomingMessage;
// type Response = typeof ServerResponse<InstanceType<Request>>;
//
export class HttpRequest extends IncomingMessage {
  public params: MapOfStringNumber = {};
  public query: URLSearchParams | null = null;
  public sessionData: MapOfANY = {};
  public app: Furi | null = null;
}

export class HttpResponse extends ServerResponse<HttpRequest> {
}

export interface ServerConfig {
  env: string;            // Run-time environment (development, production).
  port: number;          // Port server will listen for connection requests.
  hostname: string;      // Hostname server will listen for connection requests.
  callback: null | (() => void);  // Callback function that will be called when server is ready.
}

/**
 * An initialized Application Context object is passed to
 * each middleware and request handler. It provider helper
 * function to simplify work with Request and Response objects.
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
    if(typeof data === 'string') {
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
export type RequestCallback = (ctx: ApplicationContext) => boolean | void;

/**
 * Named segments and the handler callback functions for associated URI.
 */
interface RequestHandler {
  callbacks: RequestCallback[]; // Handler callback functions for associated URI.
}

/**
 * Place holder: Route attributes, uri, list of named params, handler callbacks.
 * key is a regex string of path with named segments.
*/
interface NamedRouteParam {
  useRegex: boolean;            // Use regex for path matching.
  pathNames: string[];          // Path segment names.
  key: string;                  // RegEx URI string.
  params: string[];             // URI named segments.
  callbacks: RequestCallback[]; // Handler callback functions for associated URI.
}

/**
 * Maps URI to named params and handler callback functions.
 *
 * Matching Rules:
 * For URI direct matches, the callbacks will be found in uri_map.
 * For URI with named segments, the callbacks will be found under named_param.
 */
interface UriMap {
  static_uri_map: MapOfRequestHandler;
  named_uri_map: MapOfNamedRouteParam | null;
}

/**
 * Enumerated keys for HTTP Maps.
 */
const HttpMapIndex = {
  MIDDLEWARE: 0,
  GET: 1,
  POST: 2,
  PUT: 3,
  PATCH: 4,
  DELETE: 5
}


/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi {

  // Default server configuration.
  private serverConfig: ServerConfig = {
    env: 'development',
    port: 3030,
    hostname: 'localhost',
    callback: null
  };

  private readonly httpMaps: UriMap[] = [];
  private readonly store: MapOfANY = {};

  constructor() {
    // Initialize HTTP Router lookup maps.
    Object.keys(HttpMapIndex).forEach(() => {
      this.httpMaps.push({ named_uri_map: null, static_uri_map: {} })
    });
  }

  /**
   * Class static method. Create instance of Router object.
   * @returns Instance of class Furi.
   */
  static create(): Furi {
    // LOG_DEBUG(Furi.getApiVersion());
    return new Furi();
  }

  /**
   * Get Router API version.
   * @returns API version as a string.
   */
  static getApiVersion(): string {
    return `FURI (v${API_VERSION})`;
  }

  /**
   * Parse query string into an object.
   * @param ctx:    Application context object.
   * @param simple  true will parse all values as a string,
   *                false will parse a value as a string or number.
   * @returns Parsed query string as an object, or null if no valid query parameters are found.
   */
  queryStringToObject(
    ctx: ApplicationContext,
    simple: boolean = true
  ): { [key: string]: string | string[] | number } | null {
    const queryParams: URLSearchParams | null = ctx.request?.query;
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
      this.store[key] = value;
    } else {
      return this.store[key];
    }
  }

  /**
   * Start server with specified configuration.
   * @param serverConfig  Configuration object for the server.
   * @returns Instance of http.Server.
   */
  listen(serverConfig: ServerConfig): Server {
    this.serverConfig = serverConfig;
    const { port, hostname, callback } = serverConfig;
    const server: Server = http.createServer(this.handler());
    if (port && hostname && callback) {
      server.listen(port, hostname, callback);
    } else if (port && callback) {
      server.listen(port, callback);
    } else if (port && hostname) {
      server.listen(port, hostname);
    } else {
      server.listen(port);
    }
    return server;
  }

  /**
   * Starts the Furi server with default or provided configuration.
   * @returns Instance of http.Server.
   */
  start(_callback?: () => void): Server {
    let { env, port, hostname } = this.serverConfig;

    if (Deno?.version.deno) {
      // LOG_DEBUG('Running under Deno');
      env = Deno.env.get('env') || env;
      port = Number(Deno.env.get('port')) || port;
      hostname = Deno.env.get('hostname') || hostname;
    } else {
      // LOG_DEBUG('Running under Node.js');
      env = process.env.env || env;
      port = Number(process.env.port) || port;
      hostname = process.env.hostname || hostname;
    }

    const SERVER_MESSAGE = Deno.env.get('SERVER_MESSAGE') || `Server running on '${hostname}', listening on port: '${port}\nServer in running ${env} mode.`
    const callback = _callback || (() => { console.log(SERVER_MESSAGE); })

    const serverConfig: ServerConfig = {
      env,
      port,
      hostname,
      callback
    };
    return this.listen(serverConfig);
  }

  /**
  * Assign a middleware to the provided URI lookup map.
  * There are two overloaded functions:
  * 1. Application level middleware registration.
  *     use(...fn: RequestCallback[]): Furi;
  * 2. Route level middleware registration.
  *     use(uri: string, ...fn: RequestCallback[]): Furi;
  *
  * When called without a path, the middleware is added to application level middleware.
  * When called with a path, the middleware is added to the route level.
  *
  * Middlewares without a path will be called in order of registration,
  * before other all routes, irrespective of their path. Otherwise the
  * middleware will be called in the order of registration for each route.
  *
  * @param uri  Optional String value of URI.
  * @param fn   Reference to callback functions of type RequestHandlerFunc.
  * @returns    Reference to self, allows method chaining.
  */
  use(...fn: RequestCallback[]): Furi;
  use(uri: string, ...fn: RequestCallback[]): Furi;
  use(): Furi {

    if (arguments.length === 0) {
      throw new Error('No Middleware callback function provided');
    }

    let uri = '/';
    let fn: RequestCallback[];

    if (typeof arguments[0] === 'string') {
      uri = arguments[0];
      fn = Array.from(arguments).slice(1);
      if (fn.length === 0) {
        throw new Error('No middleware callback function provided');
      }
      return this.all(uri, ...fn);
    }
    this.buildRequestMap(HttpMapIndex.MIDDLEWARE, uri, Array.from(arguments));
    return this;
  }

  /**
   * Assign Request handler to all HTTP lookup maps.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  all(uri: string, ...fn: RequestCallback[]): Furi {
    // Skip Middleware Map.
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    const count = Object.keys(HttpMapIndex).length;
    for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
      this.buildRequestMap(mapIndex, uri, fn);
    }
    return this;
  }

  /**
   * Assign a HTTP GET handler to the provided URI lookup map.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  get(uri: string, ...fn: RequestCallback[]): Furi {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    this.buildRequestMap(HttpMapIndex.GET, uri, fn);
    return this;
  }

  /**
   * Assign a HTTP PATCH handler to the provided URI lookup map.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  patch(uri: string, ...fn: RequestCallback[]): Furi {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    this.buildRequestMap(HttpMapIndex.PATCH, uri, fn);
    return this;
  }

  /**
   * Assign a HTTP POST handler to the provided URI lookup map.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  post(uri: string, ...fn: RequestCallback[]): Furi {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    this.buildRequestMap(HttpMapIndex.POST, uri, fn);
    return this;
  }

  /**
   * Assign a HTTP PUT handler to the provided URI lookup map.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  put(uri: string, ...fn: RequestCallback[]): Furi {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    this.buildRequestMap(HttpMapIndex.PUT, uri, fn);
    return this;
  }

  /**
   * Assign a HTTP DELETE handler to the provided URI lookup map.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  delete(uri: string, ...fn: RequestCallback[]): Furi {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    this.buildRequestMap(HttpMapIndex.DELETE, uri, fn);
    return this;
  }

  /**
   * Node requires a handler function for incoming HTTP request.
   * This handler function is usually passed to createServer().
   * @returns Reference to request handler function.
   */
  private handler(): Function {
    return this.dispatch.bind(this);
  }

  /**
   * Convert named segments path to a RegEx key and collect segment names.
   *
   * URI    => /aa/:one/bb/cc/:two/e
   * KEY    => /aa/(\w+)/bb/cc/(\w+)/e
   * params => ['one', 'two']
   * return => { params: ['one', 'two'], key: "/aa/(\w+)/bb/cc/(\w+)/e" }
   *
   * @param  uri URI with segment names.
   * @return Object with regex key and array with param names.
   */
  private createPathRegExKeyWithSegments(tokens: string[]): { params: string[], key: string } {

    if (!tokens || tokens?.length === 0) {
      return { params: [], key: '' };
    }

    const params: string[] = [];
    let key: string = "";

    for (const token of tokens) {
      if (token.startsWith(":")) {
        params.push(token.substring(1));
        key = `${key}/([\\w-.~]+)`;
      } else {
        key = `${key}/${token}`;
      }
    }

    return { params: params, key: key.substring(1) };
  }

  /**
   * Match URI with named segments and return param object containing
   * the property of each named segment and its value on the request object.
   *
   * @param uri: string The URI to be matched.
   * @param {segments: string[], key: string} Path object with RegEx key and segments.
   * @return null If URI doesn't match Path Object.
   * @return param Object containing property and its value for each segment from Path object.
   */
  private attachPathParamsToRequestIfExists(
    uri: string,
    pk: { params: string[], key: string },
    request: HttpRequest
  ): boolean {

    if (!pk.params || !pk.key) {
      return false;
    }

    const pat = RegExp(pk.key);
    const match = pat.exec(uri);

    if (match) {
      // LOG_DEBUG( "URI with segment(s) matched: " + JSON.stringify( pk ) );
      for (const [i, segment] of pk.params.entries()) {
        // LOG_DEBUG( "segment: " + segment );
        request.params[segment] = match[i + 1];
      }
      // LOG_DEBUG( `params: ${ JSON.stringify( request.params ) }` );
      return true;
    }
    return false;
  }

  /**
   * Build HTTP Request handler mappings and assign callback function
   * @param mapIndex  The URI Map used to look up callbacks.
   * @param uri       String value of URI.
   * @param callbacks Reference to callback functions of type RequestHandlerFunc.
   * @returns         Reference to self, allows method chaining.
   */
  private buildRequestMap(
    mapIndex: number,
    uri: string,
    callbacks: RequestCallback[]
  ): void {
    // LOG_DEBUG(uri);

    const httpMap: UriMap = this.httpMaps[mapIndex];
    /**
     * https://tools.ietf.org/html/rfc3986
     * Static URI characters
     */
    const regexCheckStaticURL = /^\/?([~\w/.-]+)\/?$/;
    const useRegex = !regexCheckStaticURL.test(uri);

    /**
     * Check URI is a static path.
     */
    if (!useRegex) {
      // Static path, we can use direct lookup.
      if (!httpMap.static_uri_map[uri]) {
        httpMap.static_uri_map[uri] = { callbacks };
      } else {
        // chain callbacks for same URI path.
        for (const callback of callbacks) {
          httpMap.static_uri_map[uri].callbacks.push(callback);
        }
      }
    }

    // Dynamic path with named parameters or Regex.
    if (!httpMap.named_uri_map) {
      // Initialize empty map
      httpMap.named_uri_map = {};
    }

    const tokens: string[] = uri.split("/");
    // Partition by "/" count, optimize lookup.
    const bucket = tokens.length - 1;
    const pathNames = useRegex ? [] : tokens;
    const { key, params } = this.createPathRegExKeyWithSegments(tokens);
    // LOG_DEBUG(('regex>', useRegex, '\tpathNames>', pathNames);

    if (!httpMap.named_uri_map[bucket]) {
      httpMap.named_uri_map[bucket] = [{ key, params, callbacks, pathNames, useRegex }];
    } else {
      httpMap.named_uri_map[bucket].push({ key, params, callbacks, pathNames, useRegex });
    }
    // LOG_DEBUG("rv: "+JSON.stringify(method.named_param[bucket]));
  }

  /**
   * Execute all application level middlewares.
   * @param ctx   Application context object.
   */
  private executeMiddlewareCallback(ctx: ApplicationContext): void {
    const middlewareMap = this.httpMaps[HttpMapIndex.MIDDLEWARE];
    const middleware_chain = middlewareMap.static_uri_map['/']?.callbacks;
    if (!middleware_chain || middleware_chain?.length === 0) { return; }
    for (const callback of middleware_chain) {
      callback(ctx);
    }
  }
  /**
   * This method routes HTTP request to an assigned handler.
   * If one does not exist a HTTP status error code is returned.
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  private dispatch(
    request: HttpRequest,
    response: HttpResponse
  ): void {
    // LOG_DEBUG( request.method, request.url );

    // Exit if response.end() was called by a middleware.
    if (response.writableEnded) { return; }

    switch (request.method) {
      case "GET":
      case "get":
        this.processHTTPMethod(HttpMapIndex.GET, request, response);
        break;

      case "POST":
      case "post":
        this.processHTTPMethod(HttpMapIndex.POST, request, response);
        break;

      case "PUT":
      case "put":
        this.processHTTPMethod(HttpMapIndex.PUT, request, response);
        break;

      case "PATCH":
      case "patch":
        this.processHTTPMethod(HttpMapIndex.PATCH, request, response);
        break;

      case "DELETE":
      case "delete":
        this.processHTTPMethod(HttpMapIndex.DELETE, request, response);
        break;

      default:
        response.writeHead(501, "HTTP Dispatch method not implemented", {
          "Content-Type": "text/plain",
          "User-Agent": Furi.getApiVersion()
        });
        console.error(`HTTP method ${request.method} is not supported.`);
        response.end();
    } // switch

  }

  /**
   * Check if each path token matches its ordinal key values,
   * named path segments always match and are saved to request.params.
   * @param pathNames Array of path segments.
   * @param keyName   Array of key names.
   * @param request  HttpRequest object.
   * @returns boolean True if all tokens match, otherwise false.
   */
  private fastPathMatch(
    pathNames: string[],
    keyName: string[],
    request: HttpRequest
  ): boolean {
    // LOG_DEBUG(('pathNames>', pathNames);
    // LOG_DEBUG(('keyName>  ', keyName);

    let didMatch: boolean = true;
    if (keyName.length === pathNames.length) {
      // LOG_DEBUG(('Equal token count');
      for (let i = pathNames.length - 1; i > 0; i--) {
        if (pathNames[i] !== keyName[i] && keyName[i][0] !== ':') {
          didMatch = false;
          break;
        } else if (keyName[i][0] === ':') {
          const key = keyName[i].substring(1); // remove ':' from start of string.
          request.params[key] = pathNames[i];
          // LOG_DEBUG((`param ${keyName[i]}=${pathNames[i]}`);
        }
      }
    } else {
      didMatch = false;
    }
    return didMatch;
  }

  /**
   * This method calls the callbacks for the mapped URL if it exists.
   * If one does not exist a HTTP status error code is returned.
   * @param mapIndex  The URI Map used to look up callbacks.
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  private processHTTPMethod(
    mapIndex: number,
    request: HttpRequest,
    response: HttpResponse,
    throwOnNotFound: boolean = true
  ): void {

    const httpMap: UriMap = this.httpMaps[mapIndex];

    if (!request.url) { return; }
    let URL = request.url;

    /** URL strip rules:
     * Remove trailing slash '/'
     * Parse query string and fragment.
     */
    const urlQuery: string[] = URL.split('?');
    if (urlQuery.length > 1 && urlQuery[1].length > 0) {
      request.query = new URLSearchParams(urlQuery[1]);
    }

    /**
     * Setup helper functions on application context object.
     */
    const applicationContext = new ApplicationContext(this, request, response,);

    URL = urlQuery[0];
    // Remove trailing slash '/' from URL.
    if (URL.length > 1 && URL[URL.length - 1] === "/") { URL = URL.substring(0, URL.length - 1); }

    try {
      if (httpMap.static_uri_map[URL]) {
        // Found direct match of static URI path.
        this.executeMiddlewareCallback(applicationContext);
        // Execute path callback chain.
        const callback_chain = httpMap.static_uri_map[URL]?.callbacks;
        if (!callback_chain || callback_chain?.length === 0) { return; }
        for (const callback of callback_chain) {
          const rv = callback(applicationContext);
          if (rv !== undefined && rv === true) {
            response.end();
            break;
          }
        }
        return;
      } else if (httpMap.named_uri_map) {
        // Search for named parameter URI or RegEx path match.

        const pathNames = URL.split("/");
        // Partition index.
        const bucket = pathNames.length - 1;
        // LOG_DEBUG(('pathNames>', pathNames);
        // LOG_DEBUG(('bucket>', bucket);

        if (httpMap.named_uri_map[bucket]) {
          if (!request.params) { request.params = {}; }

          const namedRouteParams = httpMap.named_uri_map[bucket];
          if (!namedRouteParams || namedRouteParams?.length === 0) { return; }
          for (const namedRouteParam of namedRouteParams) {
            if (!namedRouteParam.useRegex && this.fastPathMatch(pathNames, namedRouteParam.pathNames, request) ||
              namedRouteParam.useRegex && this.attachPathParamsToRequestIfExists(URL, namedRouteParam, request)) {
              // LOG_DEBUG(`params: ${JSON.stringify(request.params)}`);
              this.executeMiddlewareCallback(applicationContext);
              // Execute path callback chain.
              if (namedRouteParam?.callbacks.length > 0) {
                for (const callback of namedRouteParam.callbacks) {
                  const rv = callback(applicationContext);
                  // Check for early exit from callback chain.
                  if (rv !== undefined && rv === true) {
                    response.end();
                    break;
                  }
                }
                return;
              }
            }
          } // for
        } else if (throwOnNotFound) {
          // throw new Error(`Route not found for ${URL}`);
          LOG_WARN(`Route not found for ${URL}`);
          response.writeHead(404, {
            "Content-Type": "text/plain",
            "User-Agent": Furi.getApiVersion(),
          });
          response.end("Route not found");
          return;
        }
      }
    } catch (_ex) {
      LOG_ERROR("URI Not Found.");
      response.writeHead(404, {
        "Content-Type": "text/plain",
        "User-Agent": Furi.getApiVersion(),
      });
      response.end("Route not found");
      return;
    }
    if (throwOnNotFound) {
      // throw new Error(`Route not found for ${URL}`);
      LOG_WARN(`Route not found for ${URL}`);
      // response.statusCode = 404;
      // response.statusMessage = "Route not found";
      response.writeHead(404, {
        "Content-Type": "text/plain",
        "User-Agent": Furi.getApiVersion(),
      });
      response.end("Route not found");
    }
  }

}

