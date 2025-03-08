/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { ApplicationContext } from '../application-context.ts';
import { Middleware } from "../types.ts";
import { Furi, LOG_DEBUG, LOG_ERROR } from "../furi.ts";

/**
 * Middleware function to parse JSON bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function JSONBodyParser(ctx: ApplicationContext, next: Middleware): any {
  const body: Uint8Array[] = [];
  // LOG_DEBUG('JSONBodyParser main body enter');
  ctx.request
  .on("data", (chunk: Uint8Array) => {
    // LOG_DEBUG('JSONBodyParser on data');
    body.push(chunk);
  })
  .on("end", () => {
    // LOG_DEBUG(`JSONBodyParser body[]: ${body.length}`);
    // LOG_DEBUG(`JSONBodyParser body[]: ${body.concat().toString()}`);
    try {
      // LOG_DEBUG('JSONBodyParser on end');
      if (body.length > 0) {
        // LOG_DEBUG('JSONBodyParser on JSON parse start');
        const resultBody = JSON.parse(body.concat().toString());
        Furi.appStore.storeState('body', resultBody);
        ctx.request.body = resultBody; // Assign parsed body to request object for easy access
        // LOG_DEBUG('JSONBodyParser on JSON parse end');
      }
      // LOG_DEBUG('JSONBodyParser main next start');
      next();
      // LOG_DEBUG('JSONBodyParser main next end');
    } catch (error) {
      LOG_ERROR(`jsonBodyParser: parsing JSON body: ${error}`);
      ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
      ctx.end({ error: 'Invalid JSON' });
    }
  });
  // LOG_DEBUG('JSONBodyParser main body exit');
}
