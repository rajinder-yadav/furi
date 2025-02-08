/**
 * FURI - Fast Uniform Resource Identifier
 * The Fast and Furious Node Router
 *
 * Copyright(c) 2016 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// deno-lint-ignore-file no-unused-vars
// deno -A ./benchmark/main.ts

import { Furi, HttpRequest, HttpResponse } from "../src/furi.ts";
const furi = Furi.create();

furi.get("/", (req: HttpRequest, res: HttpResponse) => {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
    res.end('Hello world');
});

const server = furi.start();
