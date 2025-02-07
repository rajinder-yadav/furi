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

import { Furi, HttpRequest, HttpResponse } from "./furi.ts";
import { Buffer } from 'node:buffer';

const furi = Furi.create();
const USER_AGENT: string = "FURI Node Server (v0.1)";

furi.get("/", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>FURI</h1>\n");
  res.write("<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n");
  res.end();

});

furi.get("/about", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end("<h1>About FURI</h1>\nThis is the about page.\n");

});

furi.get("/about/:user_id", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>About User Page!</h1>\nUser page for: ${req.params.user_id}\n`);

});

furi.get("/user/:user_id/photo/:photo_id", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>User Photo Page!</h1>\nUser ${req.params.user_id} photo ${req.params.photo_id}\n`);

});


furi.get("/tor+onto/:code/ca\\d*n$", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end(`<h1>Toronto Canada</h1>\nCode is ${req.params.code}\n`);

});

// Handlers can be chained
// return true to terminate the call chain at any point.
furi.get("/chain", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  // Uncomment next line to stop here!
  // return true;

}, (req: HttpRequest, res: HttpResponse) => {

  res.end("<p>This paragraph is form handler 2</p>\n");

});

// Handlers can be chained
// return true to terminate the call chain at any point.
furi.get("/chainhalt", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  // Uncomment next 2 lines to stop here!
  return true;

}, (req: HttpRequest, res: HttpResponse) => {

  res.end("<p>This paragraph is form handler 2</p>\n");

});

// HTTP PATCH
furi.patch("/comment", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PATCH a fresh comment.");

});

furi.patch("/comment/how-to", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PATCH How to post a comment page.");

});

furi.patch("/comment/:id", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const body: Uint8Array[] = [];
  let text: string;

  req.on("data", chunk => {
    body.push(chunk);
  }).
    on("end", () => {
      text = Buffer.concat(body).toString();
      const data = { message: "PATCH comment with id", id: req.params.id, text: text };
      res.end(JSON.stringify(data));
    });

});

// HTTP POST
furi.post("/comment", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("POST a fresh comment.");

});

furi.post("/comment/how-to", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("POST How to post a comment page.");

});

furi.post("/comment/:id", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const body: Uint8Array[] = [];
  let text: string;

  req.on("data", chunk => {
    body.push(chunk);
  }).
    on("end", () => {
      text = Buffer.concat(body).toString();
      const data = { message: "POST comment with id", id: req.params.id, text: text };
      res.end(JSON.stringify(data));

    });

});

// HTTP PUT
furi.put("/comment", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  res.end("PUT a fresh comment.");

});

furi.put("/comment/how-to", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("PUT How to post a comment page.");

});

furi.put("/comment/:id", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`PUT comment with id: ${req.params.id}`);

});

// HTTP DELETE
furi.delete("/comment", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("DELETE a comment.");

});

furi.delete("/comment/how-to", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("DELETE How to post a comment page.");

});

furi.delete("/comment/:id", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`DELETE comment with id: ${req.params.id}`);

});

furi.use("/middleware", (req: HttpRequest, res: HttpResponse) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  res.write("About page Middleware 1\n");
});
//
furi.use("/middleware", (req: HttpRequest, res: HttpResponse) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  res.write("About page Middleware 2\n");
  return true;
});

furi.get("/middleware", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<h1>About FURI</h1>\nThis is the about page.\n");
  res.end();

});

/**
 * The next three test cases are for testing, pre, main, post requests.
 * The chained requires act like a stacked middlewares.
 */
furi.get("/middleware2", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<p>Middleware 2 pre</p>\n");

});
furi.get("/middleware2", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.write("<p>Middleware 2 GET </p>\n");

});
furi.get("/middleware2", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  res.end("<p>Middleware 2 post </p>\n");

});

furi.get("/query-check", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  res.end(JSON.stringify(req.query));

});

// HTTP GET RegEx path
furi.get("/regex/:id/dept\\d+", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  res.end("RegEx path matched.");

});

// HTTP GET RegEx path
furi.get("/regex/\\d?to*ronto", (req: HttpRequest, res: HttpResponse) => {

  // Header can only be set once!
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  res.end("RegEx for path toronto matched.");

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`Foo ${req.params.bar}`);

});

furi.get("/foo/bar", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end("Foo Bar");

});


/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar1", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`Foo ${req.params.bar} bar1`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2/bar", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`Foo ${req.params.bar} bar2 bar`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`Foo ${req.params.bar} bar2`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2/car", (req: HttpRequest, res: HttpResponse) => {

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  res.end(`Foo ${req.params.bar} bar2 car`);

});

// const server = http.createServer(furi.handler()).listen(SERVER_PORT, SERVER_HOSTNAME)
/**
 * See Furi.listen for more details.
 */
furi.start();
