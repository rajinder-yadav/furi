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
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

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
    };
  } else {
    // Set default values for missing options.
    webOptions.base = webOptions.base ?? '/';
    webOptions.web = webOptions.web ?? '/public';
    webOptions.resources = webOptions.resources ?? path.join(cwd, webOptions.base, webOptions.web, 'resources');
    webOptions.images = webOptions.images ?? path.join(webOptions.resources, 'images');
    webOptions.css = webOptions.css ?? path.join(webOptions.resources, 'css');
    webOptions.media = webOptions.media ?? path.join(webOptions.resources, 'media');
  }

  return function WebMiddleware(ctx: ApplicationContext, next: NextHandler): any {
    LOG_DEBUG('Middleware::Web enter');
    try {
      const url = ctx.request.url ?? '/';

      if (ctx.request.method === 'GET') {
        /**
         * Serve the landing page.
         */
        if (url === '/' || url === '/index.html') {
          LOG_DEBUG(`Middleware::Web url ${url}`);
          const fileName = path.join(
            cwd,
            webOptions.base!,
            webOptions.web!,
            'index.html'
          );
          LOG_DEBUG(`Middleware::Web attempting to read file: ${fileName}`);

          const staticFile = fs.readFileSync(fileName, 'utf8');
          ctx.response.writeHead(200, { 'Content-Type': 'text/html' });
          ctx.end(staticFile);
          return;
        }

        /**
         * Server the requested static file.
        */
        const fileName = path.join(
          cwd,
          webOptions.base!,
          webOptions.web!,
          url,
        );
        LOG_DEBUG(`Middleware::Web attempting to read file: ${fileName}`);

        const staticFile = fs.readFileSync(fileName, 'utf8');
        ctx.response.writeHead(200, { 'Content-Type': 'text/html' });
        ctx.end(staticFile);
        LOG_DEBUG(`Middleware::Web server file: ${fileName}`);
      }
    } catch (error) {
      ctx.response.writeHead(404, { 'Content-Type': 'text/html' });
      ctx.response.end();
      LOG_ERROR(`Middleware::Web exception caught, error: ${error}`);
    }
    LOG_DEBUG('Middleware::Web exit');
    next();
  }
}
