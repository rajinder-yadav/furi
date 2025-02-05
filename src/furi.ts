/**
 * FURI - Fast Uniform Resource Identifier
 *
 * The Fast and Furious Node Router
 * Copyright(c) 2016 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */
import * as http from "node:http";
import { IncomingMessage, ServerResponse, Server } from "node:http";

// Type definitions for request and response objects.
// Obtained from http.d.ts

// type Request  = typeof IncomingMessage;
// type Response = typeof ServerResponse<InstanceType<Request>>;

export class HttpRequest extends IncomingMessage {
  public params: { [key: string]: string | number } = {};
  public query: { [key: string]: string | number } = {};
}

export class HttpResponse extends ServerResponse<HttpRequest> {
}

export interface ServerConfig {
  port?: number;
  hostname?: string;
  callback?: () => void;
}

// Debug logging - comment our for production builds.
// const LOG_DEBUG = ( ...s: any[] ) => console.log( ...s );
const LOG_WARN = (...s: string[]) => console.log("WARNING!", ...s);
/**
 * API Version.
 */
const API_VERSION: string = "0.1.0";

/**
 * Function prototype for Request Handler
 *
 * This is pretty much the same function signature as http.Server, that is returned by http.createServer()
 *
 * @param request: HttpRequest
 * @param response: HttpResponse
 *
 * @return boolean | void - return false to cancel remaining handlers.
 *
 * When multiple request handlers are passed in as an array,
 * any one may return false to prevent the remaining handlers from getting executed.
 */
export type RequestCallback = (request: HttpRequest, response: HttpResponse) => boolean | void;

/**
 * Named segments and the handler callback functions for associated URI.
 */
interface RequestHandler {
  callbacks: RequestCallback[];
}

/**
 * Place holder: Route attributes, uri, list of named params, handler callbacks.
 * key is a regex string of path with named segments.
 */
interface NamedRouteParam {
  key: string;        // RegEx URI string
  params: string[];    // URI named segments
  callbacks: RequestCallback[];
}

/**
 * Maps URI to named params and handler callback functions.
 *
 * Matching Rules:
 * For URI direct matches, the callbacks will be found in uri_map.
 * For URI with named segments, the callbacks will be found under named_param.
 */
interface UriMap {
  static_uri_map: { [key: string]: RequestHandler };
  named_uri_map: { [key: string]: NamedRouteParam[] } | null;
}

/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi {

  private _self: Furi | null = null;

  private readonly MAP_USE: UriMap = { named_uri_map: null, static_uri_map: {} };
  private readonly MAP_GET: UriMap = { named_uri_map: null, static_uri_map: {} };
  private readonly MAP_POST: UriMap = { named_uri_map: null, static_uri_map: {} };
  private readonly MAP_PUT: UriMap = { named_uri_map: null, static_uri_map: {} };
  private readonly MAP_PATCH: UriMap = { named_uri_map: null, static_uri_map: {} };
  private readonly MAP_DELETE: UriMap = { named_uri_map: null, static_uri_map: {} };

  /**
   * Class static method. Create instance of Router object.
   * @returns Instance of class Furi.
   */
  static create(): Furi {
    // LOG_DEBUG(Furi.getApiVersion());
    const furi = new Furi();
    return furi.setSelf(furi);
  }

  /**
   * Get Router API version.
   * @returns API version as a string.
   */
  static getApiVersion(): string {
    return `FURI (v${API_VERSION})`;
  }

  /**
   * Internal helper method, saves reference to self for binding methods.
   * @param self  Instance of class Furi.
   * @returns     Reference to self.
   */
  private setSelf(self: Furi): Furi {
    this._self = self;
    return self;
  }

  /**
   * Internal helper method, parses query parameters from a URL.
   * @param query Query string to parse.
   * @returns     Map of key value pairs representing parsed query parameters.
   */
  private parseQueryParameters(query: string | null | undefined): { [key: string]: string } {
    if (!query || query.trim().length === 0) return {};

    const tokens = query.split("&");
    if (!tokens || tokens.length < 1) return {};

    const returnValue: { [key: string]: string } = {}
    for (const token of tokens) {
      const [key, value] = token.split("=");
      if (key && value && key.length > 0 && value.length > 0) {
        returnValue[key] = value;
      }
    }
    return returnValue;
  }

  // listen(port?: number, cb?: () => void): Server {
  //   const server: Server = http.createServer(this.handler());
  //   server.listen(port, cb);
  //   // if (cb) { cb(); }
  //   return server;
  // }

  /**
   * Start server with specified configuration.
   * @param serverConfig  Configuration object for the server.
   * @returns Instance of http.Server.
   */
  listen(serverConfig: ServerConfig): Server {
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
    const SERVER_PORT = Number(Deno.env.get('SERVER_PORT')) || 3030;
    const SERVER_HOSTNAME = Deno.env.get('SERVER_HOSTNAME') || '0.0.0.0';
    const SERVER_MESSAGE = Deno.env.get('SERVER_MESSAGE') || `Server running on '${SERVER_HOSTNAME}', listening on port: '${SERVER_PORT}`

    const callback = _callback || (() => { console.log(SERVER_MESSAGE); })

    const serverInfo = {
      port: SERVER_PORT,
      hostname: SERVER_HOSTNAME,
      callback
    };
    return this.listen(serverInfo);
  }

  /**
   * Node requires a handler function for incoming HTTP request.
   * This handler function is usually passed to createServer().
   * @returns Reference to request handler function.
   */
  private handler(): any {
    return this.dispatch.bind(this._self);
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
  private createPathRegExKeyWithSegments(uri: string): { params: string[], key: string } {

    const tokens: string[] = uri.split("/");
    const params: string[] = [];
    let key: string = "";

    tokens.forEach(tok => {
      if (tok.startsWith(":")) {
        params.push(tok.substring(1));
        key = `${key}/(\\w+)`;
      } else {
        key = `${key}/${tok}`;
      }
    }); // forEach

    return { params: params, key: key.substring(1) };
  }

  /**
   * Match URI with named segments and return param object containing
   * the property of each named segment and its value on the request object.
   *
   * @param uri: string The URI to be matched.
   * @param {segments: string[], key: string} Path object with RegEx key and segments.
   *
   * @return null If URI doesn't match Path Object.
   * @return param Object containing property and its value for each segment from Path object.
   */
  private attachPathParamsToRequestIfExists(
    uri: string,
    pk: { params: string[], key: string },
    request: HttpRequest
  ): boolean {

    const pat = RegExp(pk.key);
    const match = pat.exec(uri);

    if (match) {
      // LOG_DEBUG( "URI with segment(s) matched: " + JSON.stringify( pk ) );
      pk.params.forEach((segment, i) => {
        // LOG_DEBUG( "segment: " + segment );
        request.params[segment] = match[i + 1];
      });
      // LOG_DEBUG( `params: ${ JSON.stringify( request.params ) }` );
      return true;
    }
    return false;
  }

  /**
   * Assign a Middleware to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  use(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_GET, uri, fn);
  }

  /**
   * Assign a HTTP GET handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  get(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_GET, uri, fn);
  }

  /**
   * Assign a HTTP PATCH handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  patch(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_PATCH, uri, fn);
  }

  /**
   * Assign a HTTP POST handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  post(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_POST, uri, fn);
  }

  /**
   * Assign a HTTP PUT handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  put(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_PUT, uri, fn);
  }

  /**
   * Assign a HTTP DELETE handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  delete(uri: string, ...fn: RequestCallback[]): Furi {
    return this.buildRequestMap(this.MAP_DELETE, uri, fn);
  }

  /**
   * Build HTTP Request handler mappings and assign callback function
   * @param httpMap   The URI Map used to look up callbacks
   * @param uri       String value of URI.
   * @param callbacks Reference to callback functions of type RequestHandlerFunc.
   * @returns         Reference to self, allows method chaining.
   */
  private buildRequestMap(
    httpMap: UriMap,
    uri: string,
    callbacks: RequestCallback[]
  ): Furi {

    // LOG_DEBUG(uri);

    /**
     * https://tools.ietf.org/html/rfc3986
     *
     *
     * reserved    = gen-delims / sub-delims
     *
     * gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
     *
     * sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
     *             / "*" / "+" / "," / ";" / "="
     *
     * unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
     *
     */
    const reCheckStaticURL = /^\/?[a-zA-z]*([a-zA-Z0-9/.+\-_~]*\w+)?$/;

    // Ignore query string and fragment. Ignore leading slash '/'
    // const i = uri.search( /[;?]|\/$/ );
    // if (i > 1) { uri = uri.substring(0, i); }
    // if ( uri.length > 1 && uri.endsWith( "/" ) ) { uri = uri.substring( 0, uri.length - 1 ); }

    /**
     * Check URI for named routes or query params
     */
    if (reCheckStaticURL.test(uri)) {
      // Static path, we can use direct lookup
      if (!httpMap.static_uri_map[uri]) {
        httpMap.static_uri_map[uri] = { callbacks };
      } else {
        // chain callbacks for same URI path
        for (const cb of callbacks) {
          httpMap.static_uri_map[uri].callbacks.push(cb);
        }
      }
    } else {
      // Dynamic path with named parameters and query string
      // Partition by "/" count, optimize lookup
      let bucket = 0;
      for (const ch of uri) {
        if (ch === "/") { ++bucket; }
      }

      if (!httpMap.named_uri_map) {
        // Initialize empty map
        httpMap.named_uri_map = {};
      }

      const { key, params } = this.createPathRegExKeyWithSegments(uri);

      if (!httpMap.named_uri_map[bucket]) {
        httpMap.named_uri_map[bucket] = [{ key, params, callbacks }];
      } else {
        httpMap.named_uri_map[bucket].push({ key, params, callbacks });
      }
      // LOG_DEBUG("rv: "+JSON.stringify(method.named_param[bucket]));
    }
    return this;
  }

  /**
   * This method routes HTTP request to an assigned handler.
   * If one does not exist a HTTP status error code is returned.
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  private dispatch(request: HttpRequest, response: HttpResponse): void {

    // LOG_DEBUG( request.method, request.url );
    this.processHTTPMethod(this.MAP_USE, request, response, false);

    switch (request.method) {
      case "GET":
        this.processHTTPMethod(this.MAP_GET, request, response);
        break;

      case "PATCH":
        this.processHTTPMethod(this.MAP_PATCH, request, response);
        break;

      case "POST":
        this.processHTTPMethod(this.MAP_POST, request, response);
        break;

      case "PUT":
        this.processHTTPMethod(this.MAP_PUT, request, response);
        break;

      case "DELETE":
        this.processHTTPMethod(this.MAP_DELETE, request, response);
        break;

      default:
        response.writeHead(501, "Not Implemented", {
          "Content-Type": "text/plain",
          "User-Agent": Furi.getApiVersion()
        });
        console.error("HTTP method is not supported.");
        response.end();
    } // switch
  }

  /**
   * This method calls the callbacks for the mapped URL if it exists.
   * If one does not exist a HTTP status error code is returned.
   * @param httpMap    The URI Map used to look up callbacks
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  private processHTTPMethod(
    httpMap: UriMap,
    request: HttpRequest,
    response: HttpResponse,
    throwOnNotFound: boolean = true
  ) {

    if (!request.url) { return; }
    let URL = request.url;

    /** URL strip rules:
     * Remove trailing slash '/'
     * Remove query string and fragment.
     */
    // const i = URL.search(/[;?]|\/$/);
    const queryIndex = URL.search(/[;?]/);
    if (queryIndex > 0) {
      const query = URL.substring(queryIndex + 1, URL.length);
      request.query = this.parseQueryParameters(query);
      URL = URL.substring(0, queryIndex);
    }
    if (URL.length > 1 && URL.endsWith("/")) { URL = URL.substring(0, URL.length - 1); }

    try {
      if (httpMap.static_uri_map[URL]) {
        // Found direct match of static URI path
        const callback_chain = httpMap.static_uri_map[URL].callbacks;
        for (const callback of callback_chain) {
          const rv = callback(request, response);
          if (rv !== undefined && rv === false) {
            response.end();
            break;
          }
        }
        return;
      } else if (httpMap.named_uri_map) {
        // Search for named parameter URI path match
        let bucket = 0;
        // Partition search
        for (const element of URL) {
          if (element === "/") { ++bucket; }
        }

        if (httpMap.named_uri_map[bucket]) {
          if (!request.params) { request.params = {}; }

          for (const segment of httpMap.named_uri_map[bucket]) {
            if (this.attachPathParamsToRequestIfExists(URL, segment, request)) {
              // LOG_DEBUG(`params: ${JSON.stringify(request.params)}`);
              for (const callback of segment.callbacks) {
                const rv = callback(request, response);
                // Check for early exit from callback chain.
                if (rv !== undefined && rv === false) {
                  response.end();
                  break;
                }
              }
              return;
            }
          } // for
        } else if (throwOnNotFound) {
          throw new Error(`Route not found for ${URL}`);
        }
      }
    } catch (_ex) {
      LOG_WARN("URI Not Found.");
      response.writeHead(404, "Not Found", {
        "Content-Type": "text/plain",
        "User-Agent": Furi.getApiVersion()
      });
      response.end();
    }
    if (throwOnNotFound) {
      throw new Error(`Route not found for ${URL}`);
    }
  }

}

