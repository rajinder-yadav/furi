/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */


// deno-lint-ignore-file no-unused-vars

import { Furi, ApplicationContext, LOG_INFO, HttpCookiesStore, LOG_DEBUG } from "../lib/furi.ts";

const furi = Furi.create();
const USER_AGENT: string = "FURI Node Server (v0.1)";

Furi.appStore.storeState("db", { database: "Sqlite3" });

/**
 * Perform cleanup
 */
furi.preShutdown(() => {
  LOG_INFO('==> Custom cleanup called! <==');
});

furi.use(Furi.BodyParser());

furi.post("/body", (ctx: ApplicationContext) => {
  console.log(`body >>> ${JSON.stringify(ctx.appStore.storeState('body'))}`);
  console.log(`body >>> ${JSON.stringify(ctx.request.body)}`);
  ctx.end('Cookie Monster');
});

furi.get("/cookie", (ctx: ApplicationContext) => {

  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav', { SameSite: 'Strict', HttpOnly: true, Secure: true, Domain: 'www.home.net', Path: '/api/v1' });
  store.cookie('user', 'devguy').sign('user', 'max12');
  store.cookie('role', 'admin');
  store.setCookies(ctx);

  ctx.send("<h1>FURI</h1>\n");
  ctx.send("<p>Cookies have been set.</p>\n");
  ctx.end();

});

furi.get("/", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<h1>FURI</h1>\n");
  ctx.send("<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n");
  ctx.end();

});

furi.get("/about", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end("<h1>About FURI</h1>\nThis is the about page.\n");

});

furi.get("/about/:user_id", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end(`<h1>About User Page!</h1>\nUser page for: ${ctx.request.params.user_id}\n`);

});

furi.get("/user/:user_id/photo/:photo_id", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end(`<h1>User Photo Page!</h1>\nUser ${ctx.request.params.user_id} photo ${ctx.request.params.photo_id}\n`);

});


furi.get("/tor+onto/:code/ca\\d*n$", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end(`<h1>Toronto Canada</h1>\nCode is ${ctx.request.params.code}\n`);

});

// Handlers can be chained
// return true to terminate the call chain at any point.
furi.get("/chain", (ctx: ApplicationContext, next) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  // Uncomment next line to stop here!
  // return true;
  next();
}, (ctx: ApplicationContext) => {

  ctx.end("<p>This paragraph is form handler 2</p>\n");

});

// Handlers can be chained
// return true to terminate the call chain at any point.
furi.get("/chainhalt", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n");
  ctx.end();
  // Uncomment next 2 lines to stop here!

}, (ctx: ApplicationContext) => {

  ctx.end("<p>This paragraph is form handler 2</p>\n");

});

// HTTP PATCH
furi.patch("/comment", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("PATCH a fresh comment.");

});

furi.patch("/comment/how-to", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("PATCH How to post a comment page.");

});

furi.patch("/comment/:id", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const data = { message: "PATCH comment with id", id: ctx.request.params.id, text: ctx.request?.body ?? '' };
  ctx.end(JSON.stringify(data));

});

// HTTP POST
furi.post("/comment", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("POST a fresh comment.");

});

furi.post("/comment/how-to", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("POST How to post a comment page.");

});

furi.post("/comment/:id", (ctx: ApplicationContext) => {
  LOG_INFO('1 POST /comment/:id');
  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const data = { message: "POST comment with id", id: ctx.request.params.id, text: ctx.request?.body ?? '' };
  ctx.end(JSON.stringify(data));
  LOG_INFO('2 POST /comment/:id');

});

// HTTP PUT
furi.put("/comment", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  ctx.end("PUT a fresh comment.");

});

furi.put("/comment/how-to", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("PUT How to post a comment page.");

});

furi.put("/comment/:id", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`PUT comment with id: ${ctx.request.params.id}`);

});

// HTTP DELETE
furi.delete("/comment", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("DELETE a comment.");

});

furi.delete("/comment/how-to", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("DELETE How to post a comment page.");

});

furi.delete("/comment/:id", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`DELETE comment with id: ${ctx.request.params.id}`);

});

furi.use("/middleware", (ctx: ApplicationContext, next) => {
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  ctx.send("About page Middleware 1\n");
  next();
});
//
furi.use("/middleware", (ctx: ApplicationContext) => {
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });
  ctx.send("About page Middleware 2\n");
  ctx.end();
});

furi.get("/middleware", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<h1>About FURI</h1>\nThis is the about page.\n");
});

/**
 * The next three test cases are for testing, pre, main, post requests.
 * The chained requires act like a stacked middlewactx.response.
 */
furi.get("/middleware2", (ctx: ApplicationContext, next) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<p>Middleware 2 pre</p>\n");
  next();
});
furi.get("/middleware2", (ctx: ApplicationContext, next) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<p>Middleware 2 GET </p>\n");
  next();
});
furi.get("/middleware2", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end("<p>Middleware 2 post </p>\n");

});

furi.get("/query-check", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT
  });

  const result = ctx.queryStringToObject();
  LOG_DEBUG(`/query-check ${JSON.stringify(result)}`);
  ctx.end(JSON.stringify(result));
});

// HTTP GET RegEx path
furi.get("/regex/:id/dept\\d+", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  ctx.end("RegEx path matched.");

});

// HTTP GET RegEx path
furi.get("/regex/\\d?to*ronto", (ctx: ApplicationContext) => {

  // Header can only be set once!
  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  })

  ctx.end("RegEx for path toronto matched.");

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`Foo ${ctx.request.params.bar}`);

});

furi.get("/foo/bar", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end("Foo Bar");

});


/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar1", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`Foo ${ctx.request.params.bar} bar1`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2/bar", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`Foo ${ctx.request.params.bar} bar2 bar`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`Foo ${ctx.request.params.bar} bar2`);

});

/**
 * This test and the next, are to make sure that
 * Static routes are matched before Named routes.
 */
furi.get("/foo/:bar/bar2/car", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/plain",
    "User-Agent": USER_AGENT
  });

  ctx.end(`Foo ${ctx.request.params.bar} bar2 car`);

});


/**
 * Next 2 test the ALL and GET request handling.
 */
furi.all('/all', (ctx: ApplicationContext, next) => {
  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.send("<h1>All Page</h1>\n");
  next();
});

furi.get('/all', (ctx: ApplicationContext) => {
  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });
  ctx.end("<p>A paragraph all about nothing.\n");

});

/**
 * Set middleware request session data.
 */
furi.use((ctx: ApplicationContext, next) => {
  ctx.storeState('msg', { message: 'Store data' });
  ctx.sessionState('message', 'Root middleware session data');
  LOG_DEBUG('Root Middleware - pre');
  next();
});
furi.use((ctx: ApplicationContext, next) => {
  LOG_DEBUG('Root Middleware - main');
  next();
});
furi.use((ctx: ApplicationContext, next) => {
  LOG_DEBUG(`Session data 1 >>> ${ctx.request.sessionData?.message as string}`);
  LOG_DEBUG(`Store data for property "MSG" 1 >>> ${JSON.stringify(ctx.storeState('msg'))}`);
  LOG_DEBUG(`Store data for property "db" 1 >>> ${JSON.stringify(ctx.storeState('db'))}`);
  next();
});

furi.get('/headers', (ctx: ApplicationContext) => {
  LOG_DEBUG(`Session data 2 >>> ${ctx.request.sessionData?.message as string}`);
  LOG_DEBUG(`Store data for property "MSG" 2 >>> ${JSON.stringify(ctx.storeState('msg'))}`);
  LOG_DEBUG(`Store data for property "db" 2 >>> ${JSON.stringify(ctx.storeState('db'))}`);

  LOG_DEBUG(`Headers >>> ${JSON.stringify(ctx.requestHeaders())}`);
  LOG_DEBUG(`Cookies >>> ${JSON.stringify(ctx.getCookie())}`);
  LOG_DEBUG(`Store("msg") >>> ${JSON.stringify(ctx.storeState('msg'))}`);

  ctx.requestHeader('Content-Type', 'application/json');
  ctx.requestHeader('X-Powered-By', 'Furi');
  ctx.requestHeader('Authorization', 'Bearer token123');
  ctx.requestHeader('Cache-Control', 'no-cache');

  ctx.setCookie('session_id', '1234567890');
  ctx.setCookie('page_id', 'service');

  ctx.end('{"msg": "Headers set"}');
});

// const server = http.createServer(furi.handler()).listen(SERVER_PORT, SERVER_HOSTNAME)
/**
 * See Furi.listen for more details.
 */
furi.start();
