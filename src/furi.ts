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
}

export class HttpResponse extends ServerResponse<HttpRequest> {
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
export type RequestHandlerFunc = (request: HttpRequest, response: HttpResponse) => boolean | void;

/**
 * Named segments and the handler callback function for associated URI.
 */
interface UriMapHandler {
  callback: RequestHandlerFunc[];
}

/**
 * Place holder: Route attributes, uri, list of named params, handler callback.
 * key is a regex string of path with named segments.
 */
interface NamedParam {
  key: string;        // RegEx URI string
  param: string[];    // URI named segments
  callback: RequestHandlerFunc[];
}

/**
 * Maps URI to named params and handler callback function.
 * For URI with named segments, the callback will be found under named_param.
 * For URI direct matches, the callbacks will be found in uri_map.
 */
interface UriMap {
  named_param: { [key: string]: NamedParam[] } | null;
  uri_map: { [key: string]: UriMapHandler };
}

/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi {

  private _self: Furi | null = null;

  private readonly MAP_GET: UriMap = { named_param: null, uri_map: {} };
  private readonly MAP_POST: UriMap = { named_param: null, uri_map: {} };
  private readonly MAP_PUT: UriMap = { named_param: null, uri_map: {} };
  private readonly MAP_PATCH: UriMap = { named_param: null, uri_map: {} };
  private readonly MAP_DELETE: UriMap = { named_param: null, uri_map: {} };

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
  setSelf(self: Furi): Furi {
    this._self = self;
    return self;
  }

  // deno-lint(no-dupe-class-members)
  listen(port?: number, cb?: () => void): Server {
    const server: Server = http.createServer(this.handler());
    server.listen(port, cb);
    // if (cb) { cb(); }
    return server;
  }

  // listen(port?: number, hostname?: string, cb?: () => void): Server {
  //   const server: Server = http.createServer(this.handler());
  //   server.listen(port, hostname, cb);
  //   // if (cb) { cb(); }
  //   return server;
  // }

  /**
   * Node requires a handler function for incoming HTTP request.
   * This handler function is usually passed to createServer().
   * @returns Reference to request handler function.
   */
  handler(): any {
    return this.dispatch.bind(this._self);
  }

  /**
   * Convert URI with Named Segments into a RegEx string to be matched against
   * and collect segement names.
   *
   * @param  uri URI with segment names.
   * @return Object with regex key and array with segment names.
   */
  private createPathRegExKeyWithSegments(uri: string): { segments: string[], key: string } {

    const tokens: string[] = uri.split("/");
    const segments: string[] = [];
    let key: string = "";

    tokens.forEach(tok => {

      if (tok.startsWith(":")) {
        segments.push(tok.substring(1));
        key = `${key}/(\\w+)`;
      } else {
        key = `${key}/${tok}`;
      }

    }); // forEach

    return { segments: segments, key: key.substring(1) };
  }

  /**
   * Match URI with named segments and return param object containing
   * the property of each named segment and its value.
   *
   * @param uri: string The URI to be matched.
   * @param {segments: string[], key: string} Path object with RegEx key and segments.
   *
   * @return null If URI doesn't match Path Object.
   * @return param Object containing property and its value for each segment from Path object.
   */
  private getURIParams(
    uri: string,
    pk: { param: string[], key: string },
    request: HttpRequest
  ): boolean {

    const pat = RegExp(pk.key);
    const match = pat.exec(uri);

    if (match) {
      // LOG_DEBUG( "URI with segment(s) matched: " + JSON.stringify( pk ) );
      pk.param.forEach((segment, i) => {
        // LOG_DEBUG( "segment: " + segment );
        request.params[segment] = match[i + 1];
      });
      // LOG_DEBUG( `params: ${ JSON.stringify( request.params ) }` );
      return true;
    }
    return false;
  }

  /**
   * Assign a HTTP GET handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  get(uri: string, ...fn: RequestHandlerFunc[]): Furi {
    return this.mapRoute(this.MAP_GET, uri, fn);
  }

  /**
   * Assign a HTTP PATCH handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  patch(uri: string, ...fn: RequestHandlerFunc[]): Furi {
    return this.mapRoute(this.MAP_PATCH, uri, fn);
  }

  /**
   * Assign a HTTP POST handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  post(uri: string, ...fn: RequestHandlerFunc[]): Furi {
    return this.mapRoute(this.MAP_POST, uri, fn);
  }

  /**
   * Assign a HTTP PUT handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  put(uri: string, ...fn: RequestHandlerFunc[]): Furi {
    return this.mapRoute(this.MAP_PUT, uri, fn);
  }

  /**
   * Assign a HTTP DELETE handler to the provided URI.
   * @param uri  String value of URI.
   * @param fn   Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  delete(uri: string, ...fn: RequestHandlerFunc[]): Furi {
    return this.mapRoute(this.MAP_DELETE, uri, fn);
  }

  /**
   * Assign a HTTP GET handler to the provided URI.
   * @param method  The URI Map used to look up callback
   * @param uri     String value of URI.
   * @param fn      Reference to callback function of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  private mapRoute(
    method: UriMap,
    uri: string,
    fn: RequestHandlerFunc[]
  ): Furi {

    // LOG_DEBUG(uri);

    // https://tools.ietf.org/html/rfc3986
    const re = /^\/?[a-zA-z]+([a-zA-Z0-9/.+\-_]*\w+)?$/;

    // Ignore query string and fragment. Ignore leading slash '/'
    // const i = uri.search( /[;?]|\/$/ );
    // if (i > 1) { uri = uri.substring(0, i); }
    // if ( uri.length > 1 && uri.endsWith( "/" ) ) { uri = uri.substring( 0, uri.length - 1 ); }

    if (re.test(uri)) {
      method.uri_map[uri] = { callback: fn };
    } else {
      let bucket = 0;
      for (const ch of uri) {
        if (ch === "/") { ++bucket; }
      }

      if (!method.named_param) {
        method.named_param = {};
      }

      const rv = this.createPathRegExKeyWithSegments(uri);
      if (!method.named_param[bucket]) {
        method.named_param[bucket] = [{ key: rv.key, param: rv.segments, callback: fn }];
      } else {
        method?.named_param[bucket].push({ key: rv.key, param: rv.segments, callback: fn });
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
   * This method calls the callback for the mapped URL if it exists.
   * If one does not exist a HTTP status error code is returned.
   * @param method    The URI Map used to look up callback
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  private processHTTPMethod(
    method: UriMap,
    request: HttpRequest,
    response: HttpResponse
  ) {

    if (!request.url) { return; }
    let URL = request.url;

    // Ignore query string and fragment. Ignore leading slash '/'
    const i = URL.search(/[;?]|\/$/);
    if (i > 1) { URL = URL.substring(0, i); }
    if (URL.length > 1 && URL.endsWith("/")) { URL = URL.substring(0, URL.length - 1); }

    try {
      if (method.uri_map[URL]) {
        const callback_chain = method.uri_map[URL].callback;
        for (const callback of callback_chain) {
          const rv = callback(request, response);
          if (rv === false) { break; }
        }
      } else {
        if (method.named_param) {
          let bucket = 0;
          for (const element of URL) {
            if (element === "/") { ++bucket; }
          }

          if (method.named_param[bucket]) {
            if (!request.params) { request.params = {}; }

            for (const segment of method.named_param[bucket]) {
              if (this.getURIParams(URL, segment, request)) {
                // LOG_DEBUG(`params: ${JSON.stringify(request.params)}`);
                const callback_chain = segment.callback;
                for (const callback of callback_chain) {
                  const rv = callback(request, response);
                  if (rv === false) { break; }
                }
                return;
              }
            } // for
          }
        }
        throw new Error("URI Not Found!");
      }
    } catch (_ex) {
      LOG_WARN("URI Not Found.");
      response.writeHead(404, "Not Found", {
        "Content-Type": "text/plain",
        "User-Agent": Furi.getApiVersion()
      });
      response.end();
    }
  }
}

