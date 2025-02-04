/**
 * FURI - Fast Uniform Resource Identifier
 * The Fast and Furious Node Router
 *
 * Copyright(c) 2016 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import { Furi, HttpRequest, HttpResponse } from "./furi.ts";
import { Buffer } from 'node:buffer';

const furi = Furi.create();
const USER_AGENT: string = "FURI Node Server (v0.1)";

furi.get("/", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>FURI</h1>\n");
  res.write("<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n");
  res.end();

});

furi.get("/about", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end("<h1>About FURI</h1>\nThis is the about page.\n");

});

furi.get("/about/:user_id", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>About User Page!</h1>\nUser page for: ${_req.params.user_id}\n`);

});

furi.get("/user/:user_id/photo/:photo_id", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>User Photo Page!</h1>\nUser ${_req.params.user_id} photo ${_req.params.photo_id}\n`);

});


furi.get("/tor+onto/:code/ca\\d*n$", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>Toronto Canada</h1>\nCode is ${_req.params.code}\n`);

});

// Handlers can be chained
// call res.end() and return false to terminate the call chain at any point.
furi.get("/chain", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  // Uncomment next 2 lines to stop here!
  // res.end();
  // return false;

}, (_req: HttpRequest, res: HttpResponse) => {

  res.end("<p>This paragraph is form handler 2</p>\n");

});

// Handlers can be chained
// call res.end() and return false to terminate the call chain at any point.
furi.get("/chainhalt", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  // Uncomment next 2 lines to stop here!
  res.end();
  return false;

}, (_req: HttpRequest, res: HttpResponse) => {

  res.end("<p>This paragraph is form handler 2</p>\n");

});

// HTTP PATCH
furi.patch("/comment", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PATCH a fresh comment.");

});

furi.patch("/comment/how-to", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PATCH How to post a comment page.");

});

furi.patch("/comment/:id", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const body: Uint8Array[] = [];
  let text: string;

  _req.on("data", chunk => {
    body.push(chunk);
  }).
    on("end", () => {
      text = Buffer.concat(body).toString();
      const data = { message: "PATCH comment with id", id: _req.params.id, text: text };
      res.end(JSON.stringify(data));
    });

});

// HTTP POST
furi.post("/comment", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("POST a fresh comment.");

});

furi.post("/comment/how-to", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("POST How to post a comment page.");

});

furi.post("/comment/:id", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const body: Uint8Array[] = [];
  let text: string;

  _req.on("data", chunk => {
    body.push(chunk);
  }).
    on("end", () => {
      text = Buffer.concat(body).toString();
      const data = { message: "POST comment with id", id: _req.params.id, text: text };
      res.end(JSON.stringify(data));

    });

});

// HTTP PUT
furi.put("/comment", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  res.end("PUT a fresh comment.");

});

furi.put("/comment/how-to", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PUT How to post a comment page.");

});

furi.put("/comment/:id", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`PUT comment with id: ${_req.params.id}`);

});

// HTTP DELETE
furi.delete("/comment", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("DELETE a comment.");

});

furi.delete("/comment/how-to", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("DELETE How to post a comment page.");

});

furi.delete("/comment/:id", (_req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`DELETE comment with id: ${_req.params.id}`);

});

furi.use("/middleware", (_req: HttpRequest, res: HttpResponse) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  res.write("About page Middleware 1\n");
});
//
furi.use("/middleware", (_req: HttpRequest, res: HttpResponse) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  res.write("About page Middleware 2\n");
  return false;
});

furi.get("/middleware", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end("<h1>About FURI</h1>\nThis is the about page.\n");

});

furi.get("/query-check", (_req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  res.end(JSON.stringify(_req.query));

});

// const server = http.createServer(furi.handler()).listen(SERVER_PORT, SERVER_HOSTNAME)
/**
 * See Furi.listen for more details.
 */
furi.start();
