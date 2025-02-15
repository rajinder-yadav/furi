/**
 * FURI - Fast Uniform Resource Identifier
 * The Fast and Furious Node Router
 *
 * Copyright(c) 2016 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the 'GNU GENERAL PUBLIC LICENSE'.
 */

// deno-lint-ignore-file no-unused-vars
// deno -A --env-file ./benchmark/main.ts
// deno --inspect -A --env-file ./benchmark/main.ts

import { Furi, ApplicationContext } from '../src/furi.ts';
const furi = Furi.create();

furi.get('/', (ctx: ApplicationContext) => {
  ctx.response.writeHead(200, {
    'Content-Type': 'application/json'
  });
    ctx.end(JSON.stringify({hello: 'world'}));
});

furi.start();
