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
    const allowedOrigins: string | string[] = options?.origin ?? 'http://localhost:3030';
    const allowedMethods: string[] = options?.methods ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    const allowedHeaders: string[] = options?.headers ?? ['Content-Type', 'Authorization'];
    const allowCredentials: boolean = options?.credentials ?? false;
    const maxAge: number = options?.maxAge ?? 24 * 60 * 60; // 24 hours

    if (ctx.request.method === 'OPTIONS') {
      // LOG_DEBUG('CorsMiddleware OPTIONS enter');
      ctx.response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
      ctx.response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
      ctx.response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      ctx.response.setHeader('Access-Control-Allow-Credentials', allowCredentials ? 'true' : 'false');
      ctx.response.setHeader('Access-Control-Max-Age', maxAge.toString());
      ctx.response.writeHead(200);
      ctx.response.end();
      // LOG_DEBUG('CorsMiddleware OPTIONS exit');
      return;
    }
    next();
    // LOG_DEBUG('CorsMiddleware exit');
  }
}
