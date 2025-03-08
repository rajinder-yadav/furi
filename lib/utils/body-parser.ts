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
import { Furi, LOG_ERROR } from "../furi.ts";

/**
 * Middleware function to parse JSON bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function JSONBodyParser(ctx: ApplicationContext, next: Middleware): any {
  const body: Uint8Array[] = [];

  ctx.request
    .on("data", (chunk: Uint8Array) => {
      body.push(chunk);
    })
    .on("end", () => {
      try {
        if (body.length > 0) {
          const resultBody = JSON.parse(body.concat().toString());
          Furi.appStore.storeState('body', resultBody);
          ctx.request.body = resultBody; // Assign parsed body to request object for easy access
        }
        next();
      } catch (error) {
        LOG_ERROR(`jsonBodyParser: parsing JSON body: ${error}`);
        ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
        ctx.end({ error: 'Invalid JSON' });
      }
    });
}
