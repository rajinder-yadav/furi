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
import { LOG_DEBUG, LOG_ERROR } from "../../furi.ts";

export type BodyParserOptions = {
  limit?: number;
};

// Default limit size (250KB) for the request body in bytes.
const DefaultLimitSize = 250 * 1024;

/**
 * Middleware function to parse JSON, Urlencoded and Text bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function BodyParserFn(bodyParserOptions?: BodyParserOptions): HandlerFunction {
  return function BodyParserMiddleware(ctx: ApplicationContext, next: Middleware): any {
    const contentLength = ctx.request.headers['content-length'];
    const contentType = ctx.request.headers['content-type'];

    if (!contentLength || contentLength === '0' || !contentType) {
      // Skip, body is empty.
      return next();
    }

    // Default limit to 1MB if not provided.
    let options = bodyParserOptions ?? { limit: DefaultLimitSize };
    if (!options.limit) {
      options = { ...options, limit: DefaultLimitSize }; // Default to 1MB if not provided.
    }

    let currentSize = 0;
    const bodyBuffer: Uint8Array[] = [];
    // LOG_DEBUG('BodyParser main body enter');
    ctx.request
      .on('data', (chunk: Uint8Array) => {
        currentSize += chunk.length;
        // LOG_DEBUG(`BodyParser options limit=${options.limit}, currentSize=${currentSize}`);
        if (currentSize > options.limit!) {
          LOG_ERROR(`BodyParser exceeded buffer size limit of ${options.limit}, you can change this via options.`);
        }
        // LOG_DEBUG('BodyParser on data');
        bodyBuffer.push(chunk);
      })
      .on('end', () => {
        // LOG_DEBUG(`BodyParser body[]: ${body.length}`);
        // LOG_DEBUG(`BodyParser body[]: ${body.concat().toString()}`);
        try {
          // LOG_DEBUG('BodyParser on end');
          if (bodyBuffer.length > 0) {
            if (contentType === 'application/json') {
              // LOG_DEBUG('BodyParser on JSON parse start');
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

            // LOG_DEBUG('BodyParser on JSON parse end');
          }
          // LOG_DEBUG('BodyParser main next start');
          // LOG_DEBUG('BodyParser main next end');
        } catch (error) {
          LOG_ERROR(`BodyParser: parsing JSON body: ${error}`);
          // ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
          // ctx.end({ error: 'Invalid JSON' });
        }
        next();
      });
    // LOG_DEBUG('BodyParser main body exit');
  }
}


/**
 * Middleware function to parse JSON bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function JSONBodyParserFn(bodyParserOptions?: BodyParserOptions): any {
  return function JSONBodyParserMiddleware(ctx: ApplicationContext, next: Middleware): any {
    const contentLength = ctx.request.headers['content-length'];
    const contentType = ctx.request.headers['content-type'];

    if (!contentLength || contentLength === '0' || !contentType) {
      // Skip, body is empty.
      return next();
    }

    // Default limit to 1MB if not provided.
    let options = bodyParserOptions ?? { limit: DefaultLimitSize };
    if (!options.limit) {
      options = { ...options, limit: DefaultLimitSize }; // Default to 1MB if not provided.
    }

    let currentSize = 0;
    const bodyBuffer: Uint8Array[] = [];
    // LOG_DEBUG('JSONBodyParser main body enter');
    ctx.request
      .on('data', (chunk: Uint8Array) => {
        currentSize += chunk.length;
        // LOG_DEBUG(`BodyParser options limit=${options.limit}`);
        if (currentSize > options.limit!) {
          LOG_ERROR(`BodyParser exceeded buffer size limit of ${options.limit}, you can change this via options.`);
        }
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
            ctx.request.body = JSON.parse(bodyBuffer.concat().toString());

            // LOG_DEBUG('JSONBodyParser on JSON parse end');
          }
          // LOG_DEBUG('JSONBodyParser main next start');
          // LOG_DEBUG('JSONBodyParser main next end');
        } catch (error) {
          LOG_ERROR(`JSONBodyParser: parsing JSON body: ${error}`);
          // ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
          // ctx.end({ error: 'Invalid JSON' });
        }
        next();
      });
    // LOG_DEBUG('JSONBodyParser main body exit');
  }
}

/**
 * Middleware function to parse UrlEncodedParserMiddleware bodies.
 * @param {ApplicationContext} ctx - The application context.
 * @param {Middleware} next - The next middleware function in the chain.
 * @returns {any}
 */
export function UrlEncodedParserFn(bodyParserOptions?: BodyParserOptions): any {
  return function UrlEncodedParserMiddleware(ctx: ApplicationContext, next: Middleware): any {
    const contentLength = ctx.request.headers['content-length'];
    const contentType = ctx.request.headers['content-type'];

    if (!contentLength || contentLength === '0' || !contentType) {
      // Skip, body is empty.
      return next();
    }

    // Default limit to 1MB if not provided.
    let options = bodyParserOptions ?? { limit: DefaultLimitSize };
    if (!options.limit) {
      options = { ...options, limit: DefaultLimitSize }; // Default to 1MB if not provided.
    }

    let currentSize = 0;
    const bodyBuffer: Uint8Array[] = [];
    // LOG_DEBUG('JSONBodyParser main body enter');
    ctx.request
      .on('data', (chunk: Uint8Array) => {
        currentSize += chunk.length;
        // LOG_DEBUG(`UrlEncodedParser options limit=${options.limit}`);
        if (currentSize > options.limit!) {
          LOG_ERROR(`UrlEncodedParser exceeded buffer size limit of ${options.limit}, you can change this via options.`);
        }
        // LOG_DEBUG('JSONUrlEncodedParser on data');
        bodyBuffer.push(chunk);
      })
      .on('end', () => {
        // LOG_DEBUG(`JSONUrlEncodedParser body[]: ${body.length}`);
        // LOG_DEBUG(`JSONUrlEncodedParser body[]: ${body.concat().toString()}`);
        try {
          // LOG_DEBUG('JSONUrlEncodedParser on end');
          if (bodyBuffer.length > 0) {
            const resultBody = bodyBuffer.concat().toString();
            const params = new URLSearchParams(resultBody);
            ctx.request.body = {};
            for (const [key, value] of params.entries()) {
              ctx.request.body[key] = value;
            }
            // LOG_DEBUG('JSONUrlEncodedParser on JSON parse end');
          }
          // LOG_DEBUG('JSONUrlEncodedParser main next start');
          // LOG_DEBUG('JSONUrlEncodedParser main next end');
        } catch (error) {
          LOG_ERROR(`UrlEncodedParser: parsing JSON body: ${error}`);
          // ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
          // ctx.end({ error: 'Invalid JSON' });
        }
        next();
      });
    // LOG_DEBUG('JSONUrlEncodedParser main body exit');
  }
}
