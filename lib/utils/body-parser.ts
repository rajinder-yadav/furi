/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { ApplicationContext } from "../application-context.ts";
import { Middleware } from "../types.ts";
import { Furi, LOG_DEBUG, LOG_ERROR } from "../furi.ts";


/**
 * Middleware function to parse JSON bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function BodyParser(ctx: ApplicationContext, next: Middleware): any {
  const contentLength = ctx.request.headers['content-length'];
  const contentType = ctx.request.headers['content-type'];

  if (!contentLength || contentLength === '0' || !contentType) {
    // Skip, body is empty.
    return next();
  }

  const bodyBuffer: Uint8Array[] = [];
  // LOG_DEBUG('JSONBodyParser main body enter');
  ctx.request
    .on('data', (chunk: Uint8Array) => {
      // LOG_DEBUG('JSONBodyParser on data');
      bodyBuffer.push(chunk);
    })
    .on('end', () => {
      // LOG_DEBUG(`JSONBodyParser body[]: ${body.length}`);
      // LOG_DEBUG(`JSONBodyParser body[]: ${body.concat().toString()}`);
      try {
        // LOG_DEBUG('JSONBodyParser on end');
        if (bodyBuffer.length > 0) {
          if (contentType === 'application/json') {
            // LOG_DEBUG('JSONBodyParser on JSON parse start');
            ctx.request.body = JSON.parse(bodyBuffer.concat().toString());
          } else if (contentType === 'application/x-www-form-urlencoded') {
            const resultBody = bodyBuffer.concat().toString();
            const params = new URLSearchParams(resultBody);
            ctx.request.body = {};
            for (const [key, value] of params.entries()) {
              ctx.request.body[key] = value;
            }
          } else if (contentType.includes('text/')) {
            ctx.request.body = bodyBuffer.concat().toString();
          }

          // LOG_DEBUG('JSONBodyParser on JSON parse end');
        }
        // LOG_DEBUG('JSONBodyParser main next start');
        // LOG_DEBUG('JSONBodyParser main next end');
      } catch (error) {
        LOG_ERROR(`jsonBodyParser: parsing JSON body: ${error}`);
        // ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
        // ctx.end({ error: 'Invalid JSON' });
      }
      next();
    });
  // LOG_DEBUG('JSONBodyParser main body exit');
}


/**
 * Middleware function to parse JSON bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function JSONBodyParser(ctx: ApplicationContext, next: Middleware): any {
  const contentLength = ctx.request.headers['content-length']
  if (!contentLength || contentLength === '0') {
    // Skip, body is empty.
    return next();
  }

  const bodyBuffer: Uint8Array[] = [];
  // LOG_DEBUG('JSONBodyParser main body enter');
  ctx.request
    .on('data', (chunk: Uint8Array) => {
      // LOG_DEBUG('JSONBodyParser on data');
      bodyBuffer.push(chunk);
    })
    .on('end', () => {
      // LOG_DEBUG(`JSONBodyParser body[]: ${body.length}`);
      // LOG_DEBUG(`JSONBodyParser body[]: ${body.concat().toString()}`);
      try {
        // LOG_DEBUG('JSONBodyParser on end');
        if (bodyBuffer.length > 0) {
          // LOG_DEBUG('JSONBodyParser on JSON parse start');
          const resultBody = JSON.parse(bodyBuffer.concat().toString());
          Furi.appStore.storeState('body', resultBody);
          ctx.request.body = resultBody; // Assign parsed body to request object for easy access
          // LOG_DEBUG('JSONBodyParser on JSON parse end');
        }
        // LOG_DEBUG('JSONBodyParser main next start');
        // LOG_DEBUG('JSONBodyParser main next end');
      } catch (error) {
        LOG_ERROR(`jsonBodyParser: parsing JSON body: ${error}`);
        // ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
        // ctx.end({ error: 'Invalid JSON' });
      }
      next();
    });
  // LOG_DEBUG('JSONBodyParser main body exit');
}
