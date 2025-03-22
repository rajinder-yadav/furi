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
 * Web - Middleware to server Web pages and static files.
 *
 * TODO: Add caching support and pre-loading static file in memory
 *       for optimized delivery.
 *
 * The recommended default directory structure, if no options are provided is:
 *
 * project-root/
 *   |
 *   +- index.html
 *   +- public/ (put html files and directories with html files here)
 *       |
 *       +- resources/ (put static files here)
 *           |
 *           +- images/
 *           +- css/
 *           +- media/
 *           +- fonts/
 *
 */

/**
 * ====================================================================================================
 * DEVELOPER NOTES:
 *
 * This middleware uses a steam and pipes to read and servecompresses the file.
 * Since this operation is asynchronous, you MUST call startAsyncResponseTimer(time-out-ms)
 * on the ApplicationContext object "ctx". This will tell the router not to prematurely close
 * the connection and respond with a "Route not found", 404 HTTP status error.
 * The reponse will automatically close with a HTTP 408 error, if the timer expires before
 * the file has been read, compressed and sent out.
 * ====================================================================================================*/
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import zlib from 'node:zlib';
import mime from 'mime-types';

import { ApplicationContext } from '../../application-context.ts';
import { NextHandler, ContextHandler } from '../../types.ts';
import { LOG_DEBUG, LOG_ERROR } from '../../furi.ts';
// deno-lint-ignore-file no-explicit-any

/**
 * Web options for locating  Web pages and static files.
 *
 * The location of the Web pages and static files is relative to the project
 * director: "/<project-root>/<base>/<web>/<url>"
 */
export type WebOptions = {
  base?: string;
  web?: string;
  resources?: string;
  images?: string;
  css?: string;
  media?: string;
  fonts?: string;
  enableCaching?: boolean;
  enableCompression?: boolean;
  enableETag?: boolean;
};

/**
 * Middleware to serve Web pages and static files.
 * @param webOptions Optional web options.
 * @returns Middleware function to serve Web pages and static files.
 */
export function Web(webOptions?: WebOptions): ContextHandler {
  const cwd = process.cwd();

  if (!webOptions) {
    // Default web options if none provided.
    webOptions = {
      base: '/',
      web: '/public',
      resources: '/public/resources',
      images: '/public/resources/images',
      css: '/public/resources/css',
      media: '/public/resources/media',
      fonts: '/public/resources/fonts',
      enableCaching: false,
      enableCompression: true,
      enableETag: false,
    };
  } else {
    // Set default values for missing options.
    webOptions.base = webOptions.base ?? '/';
    webOptions.web = webOptions.web ?? '/public';
    webOptions.resources = webOptions.resources ?? path.join(cwd, webOptions.base, webOptions.web, 'resources');
    webOptions.images = webOptions.images ?? path.join(webOptions.resources, 'images');
    webOptions.css = webOptions.css ?? path.join(webOptions.resources, 'css');
    webOptions.media = webOptions.media ?? path.join(webOptions.resources, 'media');
    webOptions.enableCaching = webOptions.enableCaching ?? false;
    webOptions.enableCompression = webOptions.enableCompression ?? true;
    webOptions.enableETag = webOptions.enableETag ?? false;
  }

  return function WebMiddleware(ctx: ApplicationContext, next: NextHandler): any {
    // LOG_DEBUG('Middleware::Web enter');
    try {
      const url = ctx.request.url ?? '/';
      const br = zlib.createBrotliCompress();
      const gzip = zlib.createGzip();
      const brCompression = ctx.request.headers['accept-encoding']?.includes('br');
      const gzipCompression = ctx.request.headers['accept-encoding']?.includes('gzip');
      if (ctx.request.method === 'GET') {
        /**
         * Serve the landing page.
         */
        let fileName: string | null = null;
        const mimeType = mime.lookup(path.extname(url));

        // LOG_DEBUG(`Middleware::Web url ${url}`)
        if (url === '/' || url === '/index.html') {
          ctx.response.setHeader('Content-Type', 'text/html; charset=utf-8');
          fileName = path.join(
            cwd,
            webOptions.base!,
            webOptions.web!,
            'index.html'
          );
        } else if (mimeType) {
          const contentType = mime.contentType(mimeType);

          ctx.response.setHeader(
            'Content-Type',
            contentType ? contentType : 'application/octet-stream'
          );
          fileName = path.join(
            cwd,
            webOptions.base!,
            webOptions.web!,
            url
          );
        }

        // LOG_DEBUG(`Middleware::Web filename: ${fileName}`);

        if (!fileName || !fs.existsSync(fileName) || !fs.statSync(fileName).isFile()) {
          // LOG_DEBUG(`Middleware::Web file not found: ${url}, fallback to rest mode.`);
          return next();
        }

        if (webOptions.enableCompression && brCompression) {
          // LOG_DEBUG(`Middleware::Web starting brotli compressed file streaming.`);
          ctx.response.setHeader('Content-Encoding', 'br');
          ctx.response.statusCode = 200;

          if (webOptions.enableETag) {
            const fileStat = fs.statSync(fileName);
            ctx.response.setHeader('ETag',
              crypto.createHash('sha256')
                .update(`${fileName}${fileStat.mtime.getTime()}`)
                .digest('hex')
            );
          }

          ctx.startAsyncResponseTimer();
          const readStream = fs.createReadStream(fileName);
          const stream = readStream.pipe(br).pipe(ctx.response);

          stream.on('finish', () => {
            // LOG_DEBUG(`Middleware::Web sent brotli compressed file response.`);
            // Reset async mode flag, since the operation has completed.
            ctx.stopAsyncResponseTimer();
            // Cleanup resources.
            gzip.close();
            readStream.close();
          });
        } else if (webOptions.enableCompression && gzipCompression) {
          // LOG_DEBUG(`Middleware::Web starting gzip compressed file streaming.`);
          ctx.response.setHeader('Content-Encoding', 'gzip');
          ctx.response.statusCode = 200;

          ctx.startAsyncResponseTimer();
          const readStream = fs.createReadStream(fileName);
          const stream = readStream.pipe(gzip).pipe(ctx.response);

          stream.on('finish', () => {
            // LOG_DEBUG(`Middleware::Web sent gzip compressed file response.`);
            // Reset async mode flag, since the operation has completed.
            ctx.stopAsyncResponseTimer();
            // Cleanup resources.
            gzip.close();
            readStream.close();
          });
        } else {
          // LOG_DEBUG(`Middleware::Web reading file: ${fileName}`);
          const staticFile = fs.readFileSync(fileName, 'utf8');
          ctx.response.statusCode = 200;
          ctx.end(staticFile);
          // LOG_DEBUG(`Middleware::Web sent uncompressed file response.`);
        }
        return;
      }
    } catch (error) {
      LOG_ERROR(`Middleware::Web exception caught, error: ${error}`);
      // Reset async response mode.
      ctx.stopAsyncResponseTimer();

      // TODO: Should we end the response here?
      if (!ctx.response.writableEnded && ctx.response.writable) {
        ctx.response.writeHead(404, { 'Content-Type': 'text/html' });
        ctx.response.end();
      }
      return;
    }
    // LOG_DEBUG('Middleware::Web exit');
    next();
  }
}
