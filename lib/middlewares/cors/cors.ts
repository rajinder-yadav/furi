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
import { Middleware } from "../../types.ts";
import { LOG_DEBUG, LOG_ERROR } from "../../furi.ts";

export function CorsMiddleware(ctx: ApplicationContext, next: Middleware): any {
  LOG_DEBUG('CorsMiddleware enter');
  let allowedOrigins: string[] = ['http://localhost:3000']; // Replace with your allowed origins

  if(ctx.request.method === 'OPTIONS') {
    LOG_DEBUG('CorsMiddleware OPTIONS enter');
    ctx.response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
    ctx.response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    ctx.response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    ctx.response.writeHead(200);
    ctx.response.end();
    LOG_DEBUG('CorsMiddleware OPTIONS exit');
    return;
  }

  next();
  LOG_DEBUG('CorsMiddleware exit');
}
