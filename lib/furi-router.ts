/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import {
  HttpMapIndex,
  HttpRequest,
  HttpResponse,
  MapOf,
  LOG_ERROR,
  LOG_WARN,
  NamedRouteCallback,
  HandlerFunction,
  StaticRouteCallback,
  RouteMap,
} from './types.ts';

import { ApplicationContext } from './application-context.ts';
import { Furi } from './furi.ts';

const TopLevelMiddleware: string = '/';

/**
 * The FuriRouter class is responsible for two things:
 *
 * 1. The creation of the route table.
 *
 * 2. Routing HTTP requests to middlewares and the appropriate
 *    request handler based on the URI and method.
 *
 * In the process it will parse segment names for named routes.
 */
export class FuriRouter {

  protected readonly httpMethodMap: RouteMap[] = [];

  constructor(protected app: Furi) {
    // Initialize HTTP Router lookup maps.
    Object.keys(HttpMapIndex).forEach(() => {
      this.httpMethodMap.push({ namedRoutePartitionMap: {}, staticRouteMap: {} })
    });
  }

  /**
    * Assign a middleware to the provided URI lookup map.
    * There are two overloaded functions:
    * 1. Application level middleware registration.
    *     use(...fn: RequestCallback[]): FuriRouter;
    * 2. Route level middleware registration.
    *     use(uri: string, ...fn: RequestCallback[]): FuriRouter;
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
  use(router: FuriRouter): FuriRouter;
  use(uri: string, router: FuriRouter): FuriRouter;
  use(...fn: HandlerFunction[]): FuriRouter;
  use(uri: string, ...fn: HandlerFunction[]): FuriRouter;
  use(): FuriRouter {

    if (arguments.length === 0) {
      throw new Error('No Middleware callback function provided');
    }

    let uri = TopLevelMiddleware;
    let fn: HandlerFunction[];

    if (arguments[0] instanceof FuriRouter) {
      // Mounting router as top level middleware.
      this.mergeRouterMaps(arguments[0].httpMethodMap);
      return this;
    } else if (arguments[1] instanceof FuriRouter) {
      // Mounting router to a path.
      uri = arguments[0] as string;
      const routeMap: RouteMap[] = arguments[1].httpMethodMap;

      // Map all keys from supplied router with a prefix and save to this router map.
      for (let mapIndex = 0; mapIndex < routeMap.length; ++mapIndex) {

        // Map static paths.
        // let changed = false;
        const mapOfStaticRouteCallback: MapOf<StaticRouteCallback> = {};
        for (const [key, staticRouteMap] of Object.entries(routeMap[mapIndex].staticRouteMap)) {
          const prefixKey = mapIndex === 0 ? key : path.join(uri, key).replace(/\/$/, '');
          this.buildRequestMap(mapIndex, prefixKey, staticRouteMap.callbacks);

          // OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
          // mapOfStaticRouteCallback[prefixKey] = staticRouteMap;
          // changed = true;
        }

        /**
         * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
         * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
         * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
         */
        // if (changed) {
        //   // Router map is empty, create a new entry.
        //   if (Object.keys(this.httpMethodMap[mapIndex].staticRouteMap).length === 0) {
        //     // Create a new entry.
        //     this.httpMethodMap[mapIndex].staticRouteMap = {};
        //   }

        //   for (const [key, staticRouteMap] of Object.entries(mapOfStaticRouteCallback)) {
        //     if (this.httpMethodMap[mapIndex].staticRouteMap[key]?.callbacks.length > 0) {
        //       this.httpMethodMap[mapIndex].staticRouteMap[key].callbacks.push(...staticRouteMap.callbacks);
        //     } else {
        //       this.httpMethodMap[mapIndex].staticRouteMap[key] = staticRouteMap;
        //     }
        //   }
        // }

        // Map named paths.
        let changed = false;
        const mapOfNamedRouteCallback: MapOf<NamedRouteCallback[]> = {};
        for (const [k, v] of Object.entries(routeMap[mapIndex].namedRoutePartitionMap)) {
          const buckets = routeMap[mapIndex].namedRoutePartitionMap[k].length;
          for (let bucketIndex = 0; bucketIndex < buckets; ++bucketIndex) {
            const keySrc = routeMap[mapIndex].namedRoutePartitionMap[k][bucketIndex].pathNames.join('/');
            const keyDest = path.join(uri, keySrc).replace(/\/$/, '');

            this.buildRequestMap(mapIndex, keyDest, v[bucketIndex].callbacks);

            /**
             * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
             * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
             * OLD DEPRECATED CODE FOR MERGING ROUTER MAPS
             */
            // const callbacks = v[bucketIndex].callbacks;

            // const regexCheckNamedPath = /^\/?([:~\w/.-]+)\/?$/;
            // const useRegex = !regexCheckNamedPath.test(keyDest);
            // const pathNames: string[] = keyDest.replace(/(^\/)|(\/$)/g, '').split('/');
            // // Partition by '/' count, optimize lookup.
            // const bucket = pathNames.length;
            // const { key, params } = this.createNamedRouteSearchKey(pathNames);

            // changed = true;
            // if (!mapOfNamedRouteCallback[bucket]) {
            //   mapOfNamedRouteCallback[bucket] = [{ key, params, callbacks, pathNames, useRegex }];
            // } else {
            //   mapOfNamedRouteCallback[bucket].push({ key, params, callbacks, pathNames, useRegex });
            // }
          }

          // if (changed) {
          //   // Named route map is empty, so we can just merge a new map.
          //   for (const [bucket, namedRoutePartitionMap] of Object.entries(mapOfNamedRouteCallback)) {
          //     if (!this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket]) {
          //       this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket] = [];
          //     }

          //     for (const namedRouteCallback of namedRoutePartitionMap) {
          //       this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket].push(namedRouteCallback);
          //     }
          //   }

          // }
        }
      }
      return this;
    } else if (typeof arguments[0] === 'string') {
      // Route based middleware.
      uri = arguments[0];
      fn = Array.from(arguments).slice(1);
      if (fn.length === 0) {
        throw new Error('No middleware callback function provided');
      }
      return this.all(uri, ...fn);
    }

    // Top level based middleware.
    return this.buildRequestMap(HttpMapIndex.MIDDLEWARE, uri, Array.from(arguments));
  }

  /**
   * Assign Request handler to all HTTP lookup maps.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  all(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    // Skip Middleware Map.
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }

    this.get(uri, ...fn);
    this.post(uri, ...fn);
    this.put(uri, ...fn);
    this.patch(uri, ...fn);
    this.delete(uri, ...fn);

    // TODO: Learn why this is doing something strange.
    // const count = Object.keys(HttpMapIndex).length;
    // for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    //   this.buildRequestMap(mapIndex, uri, fn);
    // }
    return this;
  }

  /**
   * Assign a HTTP GET handler to the provided URI lookup map.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  get(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    return this.buildRequestMap(HttpMapIndex.GET, uri, fn);
  }

  /**
   * Assign a HTTP PATCH handler to the provided URI lookup map.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  patch(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    return this.buildRequestMap(HttpMapIndex.PATCH, uri, fn);
  }

  /**
   * Assign a HTTP POST handler to the provided URI lookup map.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  post(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    return this.buildRequestMap(HttpMapIndex.POST, uri, fn);
  }

  /**
   * Assign a HTTP PUT handler to the provided URI lookup map.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  put(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    return this.buildRequestMap(HttpMapIndex.PUT, uri, fn);
  }

  /**
   * Assign a HTTP DELETE handler to the provided URI lookup map.
   *
   * @param uri  String value of URI.
   * @param fn   Reference to callback functions of type RequestHandlerFunc.
   * @returns    Reference to self, allows method chaining.
   */
  delete(uri: string, ...fn: HandlerFunction[]): FuriRouter {
    if (fn.length === 0) {
      throw new Error('No callback function provided');
    }
    return this.buildRequestMap(HttpMapIndex.DELETE, uri, fn);
  }

  /**
   * Node requires a handler function for incoming HTTP request.
   * This handler function is usually passed to createServer().
   *
   * @returns Reference to request handler function.
   */
  protected handler(): (incomingMessage: IncomingMessage, response: ServerResponse<IncomingMessage>) => void {
    return this.dispatch.bind(this);
  }

  /**
   * Dispatches incoming HTTP requests to the appropriate handler function.
   *
   * @param request HTTP request.
   * @param response HTTP response.
   * @returns void.
   */
  public dispatch(
    incomingMessage: IncomingMessage,
    response: ServerResponse<IncomingMessage>
  ): void {
    // LOG_DEBUG( request.method, request.url );
    const request = new HttpRequest(incomingMessage);

    switch (request.method) {
      case 'GET':
      case 'get':
        this.processHTTPMethod(HttpMapIndex.GET, request, response);
        break;

      case 'POST':
      case 'post':
        this.processHTTPMethod(HttpMapIndex.POST, request, response);
        break;

      case 'PUT':
      case 'put':
        this.processHTTPMethod(HttpMapIndex.PUT, request, response);
        break;

      case 'PATCH':
      case 'patch':
        this.processHTTPMethod(HttpMapIndex.PATCH, request, response);
        break;

      case 'DELETE':
      case 'delete':
        this.processHTTPMethod(HttpMapIndex.DELETE, request, response);
        break;

      default:
        response.writeHead(501, 'HTTP Dispatch method not implemented', {
          'Content-Type': 'text/plain',
          'User-Agent': Furi.getApiVersion()
        });
        console.error(`HTTP method ${request.method} is not supported.`);
        response.end();
    } // switch
  }

  /**
   * Convert named segments path to a RegEx key and collect segment names.
   *
   * URI    => /aa/:one/bb/cc/:two/e
   * KEY    => /aa/(\w+)/bb/cc/(\w+)/e
   * params => ['one', 'two']
   * return => { params: ['one', 'two'], key: '/aa/(\w+)/bb/cc/(\w+)/e' }
   *
   * @param  uri URI with segment names.
   * @return Object with regex key and array with param names.
   */
  protected createNamedRouteSearchKey(tokens: string[]): { params: string[], key: string } {

    if (!tokens || tokens?.length === 0) {
      return { params: [], key: '' };
    }

    const params: string[] = [];
    let key: string = '';

    for (const token of tokens) {
      if (token.startsWith(':')) {
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
   * @param uri Path URI to be matched.
   * @param pk  Path object with RegEx key and segments.
   * @return    null If URI doesn't match Path Object.
   * @return    param Object containing property and its value for each segment from Path object.
   */
  protected attachPathParamsToRequestIfExists(
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
      // LOG_DEBUG( 'URI with segment(s) matched: ' + JSON.stringify( pk ) );
      for (const [i, segment] of pk.params.entries()) {
        // LOG_DEBUG( 'segment: ' + segment );
        request.params[segment] = match[i + 1];
      }
      // LOG_DEBUG( `params: ${ JSON.stringify( request.params ) }` );
      return true;
    }
    return false;
  }

  /**
   * Build HTTP Request handler mappings and assign callback function
   *
   * @param mapIndex  The URI Map used to look up callbacks.
   * @param uri       String value of URI.
   * @param callbacks Reference to callback functions of type RequestHandlerFunc.
   * @returns         Reference to self, allows method chaining.
   */
  protected buildRequestMap(
    mapIndex: number,
    uri: string,
    callbacks: HandlerFunction[]
  ): FuriRouter {
    // LOG_DEBUG(uri);

    const routeMap: RouteMap = this.httpMethodMap[mapIndex];
    /**
     * https://tools.ietf.org/html/rfc3986
     * Static URI characters
     */
    const regexCheckStaticURL = /^\/?([~\w/.-]+)\/?$/;
    const useStaticPath = regexCheckStaticURL.test(uri);

    /**
     * Check if URI is a static path.
     */
    if (useStaticPath) {
      // Static path, we can use direct lookup.
      if (!routeMap.staticRouteMap[uri]) {
        routeMap.staticRouteMap[uri] = { callbacks };
      } else {
        // chain callbacks for same URI path.
        routeMap.staticRouteMap[uri].callbacks.push(...callbacks);
      }
    } else {

      // Dynamic path with named parameters or Regex.
      const regexCheckNamedPath = /^\/?([:~\w/.-]+)\/?$/;
      const useRegex = !regexCheckNamedPath.test(uri);

      const pathNames: string[] = uri.replace(/(^\/)|(\/$)/g, '').split('/');
      // Partition by '/' count, optimize lookup.
      const bucket = pathNames.length;
      const { key, params } = this.createNamedRouteSearchKey(pathNames);
      // LOG_DEBUG(('regex>', useRegex, '\tpathNames>', pathNames);

      if (!routeMap.namedRoutePartitionMap[bucket]) {
        routeMap.namedRoutePartitionMap[bucket] = [{ key, params, callbacks, pathNames, useRegex }];
      } else {
        routeMap.namedRoutePartitionMap[bucket].push({ key, params, callbacks, pathNames, useRegex });
      }
    }
    // LOG_DEBUG('rv: '+JSON.stringify(method.named_param[bucket]));
    return this;
  }

  /**
   * Execute all top level middlewares.
   * @param applicationContext Application context object.
   */
  protected callTopLevelMiddlewares(applicationContext: ApplicationContext): void {
    const middlewareMap = this.httpMethodMap[HttpMapIndex.MIDDLEWARE];
    const middleware_chain = middlewareMap.staticRouteMap[TopLevelMiddleware]?.callbacks;
    if (!middleware_chain || middleware_chain?.length === 0) { return; }

    let callbackMiddlewareIndex = 0;
    const nextMiddleware = (): void => {
      if (callbackMiddlewareIndex < middleware_chain.length) {
        const callback = middleware_chain[callbackMiddlewareIndex++];
        const rv = callback(applicationContext, nextMiddleware);
        if (rv) {
          applicationContext.end(rv);
          return;
        }

      }
    }
    nextMiddleware();
  }

  /**
   * Check if each path token matches its ordinal key values,
   * named path segments always match and are saved to request.params.
   *
   * @param pathNames Array of path segments.
   * @param keyNames  Array of key names.
   * @param request   HttpRequest object.
   * @returns boolean True if all tokens match, otherwise false.
   */
  protected fastPathMatch(
    pathNames: string[],
    keyNames: string[],
    request: HttpRequest
  ): boolean {
    // LOG_DEBUG(('pathNames>', pathNames);
    // LOG_DEBUG(('keyName>  ', keyName);

    let didMatch: boolean = true;
    if (keyNames.length === pathNames.length) {
      // LOG_DEBUG(('Equal token count');
      for (let i = pathNames.length - 1; i >= 0; i--) {
        if (pathNames[i] !== keyNames[i] && keyNames[i][0] !== ':') {
          didMatch = false;
          break;
        } else if (keyNames[i][0] === ':') {
          const key = keyNames[i].substring(1); // remove ':' from start of string.
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
   *
   * @param mapIndex  The URI Map used to look up callbacks.
   * @param request   Reference to Node request object (IncomingMessage).
   * @param response  Reference to Node response object (ServerResponse).
   */
  protected processHTTPMethod(
    mapIndex: number,
    request: HttpRequest,
    response: HttpResponse,
    throwOnNotFound: boolean = true
  ): void {

    const routeMap: RouteMap = this.httpMethodMap[mapIndex];

    let URL = request.url!;

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
    const applicationContext = this instanceof Furi
      ? new ApplicationContext(this, request, response)
      : new ApplicationContext(this.app, request, response);

    URL = urlQuery[0];
    // Remove trailing slash '/' from URL.
    if (URL.length > 1 && URL[URL.length - 1] === '/') { URL = URL.substring(0, URL.length - 1); }

    try {
      if (routeMap.staticRouteMap[URL]) {
        // Found direct match of static URI path.
        this.callTopLevelMiddlewares(applicationContext);
        // Execute path callback chain.
        const callback_chain = routeMap.staticRouteMap[URL]?.callbacks;
        if (!callback_chain || callback_chain?.length === 0) { return; }
        let callbackIndex = 0;

        const nextStatic = (): void => {
          if (callbackIndex < callback_chain.length) {
            const callback = callback_chain[callbackIndex++];
            const rv = callback(applicationContext, nextStatic);
            if (rv) {
              applicationContext.end(rv);
              return;
            }
          }
        }
        return nextStatic();

      } else if (routeMap.namedRoutePartitionMap) {
        // Search for named parameter URI or RegEx path match.

        const pathNames = URL.replace(/(^\/)|(\/$)/g, '').split('/');
        // Partition index.
        const bucket = pathNames.length;
        // LOG_DEBUG(('pathNames>', pathNames);
        // LOG_DEBUG(('bucket>', bucket);

        if (routeMap.namedRoutePartitionMap[bucket]) {
          if (!request.params) { request.params = {}; }

          const namedRouteParams = routeMap.namedRoutePartitionMap[bucket];
          if (!namedRouteParams || namedRouteParams?.length === 0) { return; }
          for (const namedRouteParam of namedRouteParams) {
            if (!namedRouteParam.useRegex && this.fastPathMatch(pathNames, namedRouteParam.pathNames, request) ||
              namedRouteParam.useRegex && this.attachPathParamsToRequestIfExists(URL, namedRouteParam, request)) {
              // LOG_DEBUG(`params: ${JSON.stringify(request.params)}`);
              this.callTopLevelMiddlewares(applicationContext);
              // Execute path callback chain.
              if (namedRouteParam?.callbacks.length > 0) {

                let callbackNamedRouteIndex = 0;

                const nextNamedRoute = (): void => {
                  if (callbackNamedRouteIndex < namedRouteParam.callbacks.length) {
                    const callback = namedRouteParam.callbacks[callbackNamedRouteIndex++];
                    const rv = callback(applicationContext, nextNamedRoute);
                    if (rv) {
                      applicationContext.end(rv);
                      return;
                    }

                  }
                }
                return nextNamedRoute();
              }
            }
          } // for
        } else if (throwOnNotFound) {
          // throw new Error(`Route not found for ${URL}`);
          LOG_WARN(`Route not found for ${URL}`);
          response.writeHead(404, {
            'Content-Type': 'text/plain',
            'User-Agent': Furi.getApiVersion(),
          });
          response.end('Route not found');
          return;
        }
      }
    } catch (_ex) {
      LOG_ERROR('URI Not Found.');
      response.writeHead(404, {
        'Content-Type': 'text/plain',
        'User-Agent': Furi.getApiVersion(),
      });
      response.end('Route not found');
      return;
    }
    if (throwOnNotFound) {
      // throw new Error(`Route not found for ${URL}`);
      LOG_WARN(`Route not found for ${URL}`);
      // response.statusCode = 404;
      // response.statusMessage = 'Route not found';
      response.writeHead(404, {
        'Content-Type': 'text/plain',
        'User-Agent': Furi.getApiVersion(),
      });
      response.end('Route not found');
    }
  }

  /**
   * Merge given router maps into existing top-level router map.
   * This will occur when the caller adds a route-less router middleware.
   *
   * @param routeMap UriMap[] to merge into the current httpMaps.
   * @return void
   */
  protected mergeRouterMaps(routeMap: RouteMap[]): void {
    for (let mapIndex = 0; mapIndex < routeMap.length; ++mapIndex) {
      // Static route map.
      if (Object.keys(this.httpMethodMap[mapIndex].staticRouteMap).length === 0) {
        // Static route map is empty, so we can just merge a new map.
        this.httpMethodMap[mapIndex].staticRouteMap = {};
      }
      for (const [key, staticRouteMap] of Object.entries(routeMap[mapIndex].staticRouteMap)) {
        if (this.httpMethodMap[mapIndex].staticRouteMap[key]?.callbacks.length > 0) {
          this.httpMethodMap[mapIndex].staticRouteMap[key].callbacks.push(...staticRouteMap.callbacks);
        } else {
          this.httpMethodMap[mapIndex].staticRouteMap[key] = staticRouteMap;
        }
      }

      // Named route map is empty, so we can just merge a new map.
      for (const [bucket, namedRoutePartitionMap] of Object.entries(routeMap[mapIndex].namedRoutePartitionMap)) {
        if (!this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket]) {
          this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket] = [];
        }

        for (const namedRouteCallback of namedRoutePartitionMap) {
          this.httpMethodMap[mapIndex].namedRoutePartitionMap[bucket].push(namedRouteCallback);
        }
      }



    }
  }

}
