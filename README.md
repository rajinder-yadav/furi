# FURI - Fast Uniform Resource Identifier

![Image](./images/dolphin.jpeg)

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [FURI - Fast Uniform Resource Identifier](#furi---fast-uniform-resource-identifier)
  - [A Return to Simplicity ✅](#a-return-to-simplicity-)
    - [BOM - Bill of Material](#bom---bill-of-material)
    - [Coding with JavaScript](#coding-with-javascript)
    - [Coding with TypeScript](#coding-with-typescript)
    - [Using NPM and Node.js](#using-npm-and-nodejs)
    - [Using Deno](#using-deno)
  - [Declare a named route](#declare-a-named-route)
    - [Use a router to declare routes](#use-a-router-to-declare-routes)
    - [Mounting top-level middlewares](#mounting-top-level-middlewares)
    - [Declaring route based middlewares](#declaring-route-based-middlewares)
  - [Array based routing](#array-based-routing)
    - [Declaring a Handler Class](#declaring-a-handler-class)
    - [Declaring top-level middleware](#declaring-top-level-middleware)
    - [Declaring route-level middleware](#declaring-route-level-middleware)
    - [Configuration file](#configuration-file)
  - [Super fast stream logging ⚡](#super-fast-stream-logging-)
    - [Logger configuration](#logger-configuration)
    - [Log levels](#log-levels)
    - [Sample log output](#sample-log-output)
  - [Motivation](#motivation)
  - [Why](#why)
  - [Benchmarks 🚀](#benchmarks-)
    - [FURI Benchmark](#furi-benchmark)
    - [Fastify Benchmark](#fastify-benchmark)
    - [Express Benchmark](#express-benchmark)

<!-- /code_chunk_output -->

## A Return to Simplicity ✅

FURI is a Node.js framework coded in TypeScript. If you love TypeScript, you will feel at home coding with FURI. If you love plain JavaScript, you will love coding in FURI, you get to decide.

The design has been kept as close to the Node.js API without using external dependencies, using modern JavaScript and the latest Node.js APIs.

 The Router was coded from the ground up in TypeScript, it is the core of the framework, with a blazing fast lookup and matching algorithm.

Zero useless abstraction, simple clean coding, designed for hardware with small resources. Perfect for micro-architecture. Very little between your code and the Node.js API to minimize performance overhead.

Router has been battle tested with unit tests and functional tests.

A self contained design and zero external dependencies means there is  less surface area for bugs and security issues to hide and creep in. There is less likelihood for working code to break after pulling in updates. Having to maintain perfect working code broken due to an update is an anti-pattern and an insane mindset to develop software.

FURI will keep simple things simple and make hard things easier without breaking your working code. It is however still in the early preview stage so expect changes as I explore design ideas.

### BOM - Bill of Material

The following tools, technologies and software was used in the development of FURI (v0.1.4).

Item | Version | Description
--- | --- | ---
TypeScript | 5.7.3 | A super-set of JavaScript that adds static typing and other features to the language.
yaml | 2.7.0 | A library for parsing YAML used to read FURI configuration file.
@deno/dnt | 0.41.3 | A tool for building NPM packages.
@std/assert | 1.0.11 | Deno standard library for assertions, used in test code.
Deno | 2.2.1 | A runtime environment for JavaScript that aims to be secure and fast.
Node.js | 20.18.3 LTS | The runtime environment for JavaScript.
Linux | 6.13.1-1-default | openSUSE Tumbleweed with KDE desktop

__NOTE__: See Changelog for additional details on changes and updates. ✅

### Coding with JavaScript

__File: "main.js"__

```ts
import { Furi } from '@furi-server/furi';
const furi = Furi.create();

furi.get('/', (ctx) => {
    return { message: 'Hello World' };
});

furi.start();
```

### Coding with TypeScript

You can use TypeScript with Node.js, but you will need to compile the TypeScript code to JavaScript before running it with Node.js.

With Deno it is simpler, as it will run the TypeScript code without needing a separate compile step.

__File: "main.ts"__

```ts
import { Furi, ApplicationContext } from '@furi-server/furi';
const furi = Furi.create();

furi.get('/', (ctx: ApplicationContext) => {
    return { message: 'Hello World' };
});

furi.start();
```

### Using NPM and Node.js

To install the NPM package, use:

```sh
npm install @furi-server/furi
```

### Using Deno

If you are using Deno, add the package with:

```sh
deno add npm:@furi-server/furi
```

## Declare a named route

The code below shows how to declare a named route, and also how to read the named route parameters from the hanlder function, using the `ApplicationContext` object.

```ts
furi.get("/about/:user_id", (ctx: ApplicationContext) => {

  ctx.response.writeHead(200, {
    "Content-Type": "text/html",
    "User-Agent": USER_AGENT
  });

  ctx.end(`<p>User page for: ${ctx.request.params.user_id}</p>\n`);
});
```

### Use a router to declare routes

Below we declare a route honder on a router, then we mouth the router to the Furi instance.

```ts
const furi = Furi.create();
const router = Furi.router();

router.get('/home', (ctx: ApplicationContext) => {
  ctx.response.writeHead(200, {
    'Content-Type': 'text/html',
    'User-Agent': USER_AGENT
  });
  ctx.send('<h1>Home Page</h1>\n');
  ctx.send('<p>Welcome to the home page.</p>\n');
  ctx.end();
});

furi.use(router);
```

Mounting to a route path:

This will mount the router to the "__/v1/api__" path. The "__/home__" route will be accessible at "__/v1/api/home__".

```ts
furi.use('/v1/api', router);
```

### Mounting top-level middlewares

You can mount top-level middlewares to the Furi instance. These middlewares will be executed for every request.

1. A top-level middleware is mounted using "__use()__" method.
1. The handler function take two arguments:
    - Application context object.
    - Next function to call the next middleware or handler.

__NOTE__: The last handler function must end the request with a call to "__end()__", or returning a value.

```ts
router.use((ctx: ApplicationContext, next) => {
  ctx.send('Top-level Middleware 1\n');
  next();
});
router.use((ctx: ApplicationContext, next) => {
  ctx.send('Top-level Middleware 2\n');
  next();
});
```

### Declaring route based middlewares

```ts
router.get('/home', (ctx: ApplicationContext, next) => {
  ctx.send('Middleware 1\n');
  next();
});
router.get('/home', (ctx: ApplicationContext, next) => {
  ctx.send('Middleware 2\n');
  next();
});
router.get('/home', (ctx: ApplicationContext, next) => {
  ctx.send('<h1>Home Page</h1>\n');
  ctx.end('<p>Welcome to the home page.</p>\n');
});
```

## Array based routing

FURI now supports array based routes. You declare one or more routes in the "routes" array.

Each route entry requires three properties:

1. method
1. path
1. controller

__NOTE__: the "__controller__" property can be a single handler function, or multiple handlers declared inside the "controller" array. See: [Declaring route-level middleware](#declaring-route-level-middleware).

Here is an example of a route with an inline lambda handler:

```ts
import { Furi } from '@furi-server/furi';
const furi = Furi.create();

const routes: Routes = {
  routes: [
    {
      method: 'get',
      path: '/one',
      controller: (ctx: ApplicationContext, next) => {
        ctx.response.writeHead(200, {
          'Content-Type': 'text/html',
          'User-Agent': USER_AGENT
        });
        ctx.end('Middleware Pre!\n');
      }
    }
  ]
}

furi.use(routes);
```

You can also mount the array route on a path:

```ts
furi.use('/v1/api', routes);
```

You can also mount the array on a router and then mount that to the app:

```ts
const router = Furi.router();
router.use(routes);

furi.use('/admin',router);
```

__NOTE__: Top-level middlewares, even when mounted to a router, that are then mounted to the route-path will always remain top-level middlewares. Array based middleware routes are declared further below.

### Declaring a Handler Class

To declare the class based handler, you will need to:

1. Subclass "__BaseRouterHandler__".
2. Override the "__handle()__" method.

__NOTE__: You can also declare a class based middleware, the handler function will also need to accept the "__next__" argument.

```ts
class HelloWordHandler extends BaseRouterHandler {

   override handle(ctx: ApplicationContext): any {
        ctx.response.writeHead(200, {
            'Content-Type': 'text/plain',
            'User-Agent': USER_AGENT
        });
        // ctx.end('HelloWordHandler\n');
        return 'HelloWordHandler\n';
    }
}
```

In the router array, you simply pass the class name to the controller property:

```ts
const routes: Routes = {
  routes: [
    {
      method: 'get',
      path: '/helloworld',
      controller: HelloWordMiddlewareHandler
    }
  ]
};

const router = Furi.router();
router.use(routes);
```

### Declaring top-level middleware

Remember will middleware, from the handler function you will need to call "next()" to pass control to the next middleware or handler.

```ts
function myMiddleware(ctx: ApplicationContext, next) {
  ctx.response.writeHead(200, {
    'Content-Type': 'text/html',
    'User-Agent': USER_AGENT
  });
  ctx.send('Middleware Pre!\n');
  next();
}
```

In the router array, the top-level middlewares are declared in the middleware array:

```ts
const routes: Routes = {
  middleware: [
    myMiddleware
  ],
  routes: [
    ...
  ]
};
```

### Declaring route-level middleware

As with the function based routes, you can also declare route-level middleware in route array:

```ts
const routes: Routes = {
  routes: [
    {
      method: 'get',
      path: '/one',
      controller: (ctx: ApplicationContext, next) => {
        ctx.response.writeHead(200, {
          'Content-Type': 'text/html',
          'User-Agent': USER_AGENT
        });
        ctx.send('Middleware Pre!\n');
        next();
      }
    },
    {
      method: 'get',
      path: '/one',
      controller: (ctx: ApplicationContext, next) => {
        ctx.response.writeHead(200, {
          'Content-Type': 'text/html',
          'User-Agent': USER_AGENT
        });
        ctx.end('Hello World!\n');
      }
    },
  ]
};
```

Since you are declaring  multiple route handlers on the same route, you can simplify the declaration. Just combine the handler functions in the "__controller__" array, like this:

```ts
const routes: Routes = {
  routes: [
    {
      method: 'get',
      path: '/one',
      controller: [
        (ctx: ApplicationContext, next) => {
          ctx.response.writeHead(200, {
            'Content-Type': 'text/html',
            'User-Agent': USER_AGENT
          });
          ctx.send('Middleware Pre!\n');
          next();
        },
        (ctx: ApplicationContext, next) => {
          ctx.response.writeHead(200, {
            'Content-Type': 'text/html',
            'User-Agent': USER_AGENT
          });
          ctx.end('Hello World!\n');
        }
      ]
    },
  ]
};
```

### Configuration file

FURI lets you configure server settings from a YAML file. This allows you to easily change settings without having to modify your code.

__File: "furi.yaml" (optional)__

```yaml
server:
  port: 3030
  host: localhost
  env: development
```

FURI is currently under development. However it is feature complete with respect to the Router, and today could be put into production use. Current development effort is focused on adding support for a easy to use State management store for seamless data access. Persistence using SQLite3 as the default database engine, with a plug-in architecture for other DB engines.

## Super fast stream logging ⚡

FURI supports fist-class logging at the code. Logging is fast and takes place on a background worker-thread, so the main thread never blocks. Logging can be buffered, or immediately written to file. Logging behavior can be configured in FURI's configuration YAML file.

Logging uses the latest Node.js features. Since logging is the core functionality of FURI, there is very little code overhead compared to existing logging libraries.

Note file logging is disabled by default, you must enable it in FURI YAML configuration file.

### Logger configuration

Here are the configurable logging options:

- __flushPeriod__: Control time to flush buffered log messages.
- __maxCount__: Maximum number of log messages before flushing.
- __mode__: Can be one of "stream" or "buffered".
- __level__: Can be one of "debug", "info", "log", "warn", "error", "critical" or "fatal".

The level is used to filter log messages based on their severity. Only messages at or above the configured level will be logged.

If you do not declare any logger settings, the following are the default setting values:

```yaml
logger:
  enabled: false
  flushPeriod: 1000
  logFile: furi.log
  maxCount: 100
  mode: buffered
  level: info
```

To enable logging you only need to change one setting:

```yaml
logger:
  enabled: true
```

This will result in buffered logging, if you want to view immediate logging, you can switch to stream mode:

```yaml
logger:
  enabled: true
  mode: stream
```

### Log levels

It is suggested for Users application code, you log at the "log" level. The framework logs at the "info" level, to provide additional information on the request. However should you ever want to limit logging to your own  application code while developing, it will help reduce the log noise.

The following log levels are supported, list in increasing order of severity:

Level | Description
------|-------------
debug | Verbose output for debugging purposes.
info  | Default log, details operations information.
log | General User application level logging.
warn | State that is not a normal operation.
error | Application level error needing investigation.
critical | System level error that may cause application to fail.
fatal | Unrecoverable error causing application to terminate.

### Sample log output

```txt
2025-03-01T18:31:34.979Z, INFO, FURI Server (v0.2.0) started { host: 'localhost', port: 3030, mode: 'development' }
2025-03-01T18:31:37.842Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 38684, http: 1.1, method: GET, url: /
2025-03-01T18:31:37.855Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 38694, http: 1.1, method: GET, url: /
2025-03-01T18:31:37.856Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 38696, http: 1.1, method: GET, url: /about
2025-03-01T18:31:37.858Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 38706, http: 1.1, method: GET, url: /about/
2025-03-01T18:31:37.859Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 38710, http: 1.1, method: GET, url: /about/raj12
```

## Motivation

![Image](./images/octopus.jpeg)

The primary objective of the FURI project is to provide a fast, small HTTP server that runs on small hardware with low memory. This benefits micro-architect environments with scaling and performance, with faster load time, compact footprint to maximize bigger production workloads.

The guiding principle of the project is to have the code base self contain with no external dependencies. This allows for easy deployment and maintenance on any platform that supports Node.js. The aim is for small independent shops to be able to run a production server and website while keeping the cost down substantially, along with the effort to maintain the setup.

## Why

A fast, responsive and lightweight framework that is easy to use. FURI keeps your code simple, avoids useless abstraction and does not get in the way with working with Node.js core APIs should you ever need to.

Inspired by Express.js and Koa.

## Benchmarks 🚀

FURI outperformed both Fastify and Express.js 5.0 in a benchmark test.
Below are the benchmarks results.

1. Number of requests made: 100,000
1. Total time taken in seconds.
1. Requests handled in 1 second.

Framework | Requests | Total Time | Requests handled / sec
-|-|-|-
FURI | 100,000 | 12.670 s | 7892.63
Fastify | 100,000 | 14.486 s | 7124.84
Express.js v5.0 | 100,000 | 13.882 s | 7203.31

### FURI Benchmark

![FURI](./images/furi-benchmark.png)

### Fastify Benchmark

![Fastify](./images/fastify-benchmark.png)

### Express Benchmark

![Express](./images/express-benchmarks.png)
