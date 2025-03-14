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
 * CORS - Cross Origin Resource Sharing.
 *
 * This middleware provides support for Cross-Origin Resource Sharing (CORS).
 * It allows you to specify which origins are allowed to access your resources,
 * and what methods, headers, and credentials can be used in cross-origin requests.
 *
 * It also provides support for preflight requests, which are used to check if a
 * cross-origin request is allowed before making the actual request.
 *
 * CORS is a security feature that helps prevent cross-site scripting (XSS) attacks,
 * and other types of attacks where an attacker can use a user's browser to make
 * requests on behalf of the user without their knowledge or consent.
 *
 * This middleware sends backs the appropriate CORS headers to the client
 * (usually a web browser), based on the request and the options provided.
 * If the  request is not allowed, it sends back a 403 Forbidden response,
 * and does not send any CORS headers.
 *
 * RFC 6454: The Web Origin Concept
 * https://www.rfc-editor.org/rfc/rfc6454.html
 */

// deno-lint-ignore-file no-explicit-any
import { ApplicationContext } from "../../application-context.ts";
import { Middleware, HandlerFunction } from "../../types.ts";
import { LOG_DEBUG } from "../../furi.ts";

/**
 * CORS middleware options.
 */
export type CorsOptions = {
  origin?: string | string[];
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
  maxAge?: number;
};

/**
 * CORS middleware function.
 * @param ctx - The application context.
 * @param options  CORS options
 * @returns
 */
export function Cors(options?: CorsOptions): HandlerFunction {
  return function CorsMiddleware(ctx: ApplicationContext, next: Middleware): any {
    // LOG_DEBUG('CorsMiddleware enter');
    const allowedOrigins: string | string[] = options?.origin ?? '*';
    const allowedMethods: string[] = options?.methods ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    const allowedHeaders: string[] = options?.headers ?? ['Content-Type', 'Authorization'];
    const allowCredentials: boolean = options?.credentials ?? false;
    const maxAge: number = options?.maxAge ?? 24 * 60 * 60; // 24 hours

    ctx.response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
    ctx.response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
    ctx.response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    ctx.response.setHeader('Access-Control-Allow-Credentials', allowCredentials ? 'true' : 'false');
    ctx.response.setHeader('Access-Control-Max-Age', maxAge.toString());

    if (ctx.request.method === 'OPTIONS') {
      // LOG_DEBUG('CorsMiddleware OPTIONS enter');
      ctx.response.writeHead(200);
      ctx.response.end();
      // LOG_DEBUG('CorsMiddleware OPTIONS exit');
      return;
    }
    next();
    // LOG_DEBUG('CorsMiddleware exit');
  }
}
