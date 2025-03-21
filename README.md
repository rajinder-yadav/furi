# Furi - Fast HTTP/HTTPS Server framework

This project makes use of "DevContainers" to make on boarding new developers a snap! A DevContainers is a requirement to setup a CI/CD pipeline on GitHub. This feature was added by [Martial Rioux](https://www.linkedin.com/in/martialrioux/) as future proofing. Reach out to him for Devops and Cloud solutions needs.

Currently I am the only Software Developer working on this project in my free time as I seek work. If you are hiring or know someone is, please reach out to me at: <rajinder.yadav@hotmail.com>, or connect with me on [Linkedin](https://www.linkedin.com/in/rajinderyadav/). I am available both in a full-time capacity or as a Consultant (Corp to Corp) for your project needs. I reside in Toronto, Ontario, Canada! 🇨🇦

![Image](./images/dolphin.jpeg)

## FEATURE UPDATES 🚨

![image sqlite3](./images/sqlite.svg)

- New embedded Sqlite3 support for in-memory application state management.
- Minor breaking-change with logger configuration and code refactoring.

Planned work for Sqlite3 and state management. 🎯

1. Allow state management to persiste on disk.
1. Add configuration to choose betweek in-memory and disk-based state management.
1. Add seamless caching support to speed response time for web pages and REST APIs.
1. Add an application cache store, for custom caching logic and data retrieval.
1. Add schema support to declare the structure of the application store database table.
1. Add new accessor methods to allow for flexible types when using the state management system.

Always check the changelog before pulling updates to see what changed. Furi is in early preview mode, so expect rapid changes, some breaking.

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Furi - Fast HTTP/HTTPS Server framework](#furi---fast-httphttps-server-framework)
  - [FEATURE UPDATES 🚨](#feature-updates-)
  - [A Return to Simplicity ✅](#a-return-to-simplicity-)
  - [BOM - Bill of Material](#bom---bill-of-material)
  - [Example source code](#example-source-code)
  - [Coding with JavaScript](#coding-with-javascript)
    - [Coding with TypeScript](#coding-with-typescript)
    - [Using NPM and Node.js](#using-npm-and-nodejs)
    - [Using Deno](#using-deno)
  - [Startup message](#startup-message)
  - [Declare a named route](#declare-a-named-route)
    - [Use a router to declare routes](#use-a-router-to-declare-routes)
    - [Mounting top-level middlewares](#mounting-top-level-middlewares)
    - [Declaring route based middlewares](#declaring-route-based-middlewares)
  - [Supported middlewares](#supported-middlewares)
  - [Array based routing](#array-based-routing)
    - [Declaring a Handler Class](#declaring-a-handler-class)
    - [Declaring top-level middleware](#declaring-top-level-middleware)
    - [Declaring route-level middleware](#declaring-route-level-middleware)
  - [Server Configuration file](#server-configuration-file)
  - [Configuration file](#configuration-file)
  - [Server properties](#server-properties)
  - [Super fast stream logging ⚡](#super-fast-stream-logging-)
    - [Logger configuration](#logger-configuration)
    - [Log levels](#log-levels)
  - [Enabling HTTPS Support](#enabling-https-support)
    - [Using a SSL certificate](#using-a-ssl-certificate)
    - [Using a SSL certificate with a passphrase](#using-a-ssl-certificate-with-a-passphrase)
    - [Sample log output](#sample-log-output)
  - [Motivation](#motivation)
  - [Why](#why)
  - [Benchmarks 🚀](#benchmarks-)
    - [Furi Benchmark](#furi-benchmark)
    - [Fastify Benchmark](#fastify-benchmark)
    - [Express Benchmark](#express-benchmark)

<!-- /code_chunk_output -->

## A Return to Simplicity ✅

Furi is a Node.js framework coded in TypeScript. If you love TypeScript, you will feel at home coding with Furi. If you love plain JavaScript, you will love coding in Furi, you get to decide.

The design has been kept as close to the Node.js API without using external dependencies. Coded using modern JavaScript and the latest Node.js APIs.

 The Router was coded from the ground up in TypeScript, it is the core of the framework, with a blazing fast lookup and matching algorithm.

Zero useless abstraction, simple clean coding, designed for hardware with small resources. Perfect for micro-architecture. Very little between your code and the Node.js API to minimize performance overhead.

Router has been battle tested with unit tests and functional tests.

A self contained design and zero external dependencies means there is  less surface area for bugs and security issues to hide and creep in. There is less likelihood for working code to break after pulling in updates. Having to maintain perfect working code broken due to an update is an anti-pattern and an insane mindset to develop software.

Furi will keep simple things simple and make hard things easier without breaking your working code. It is however still in the early preview stage so expect changes as I explore design ideas.

Furi is currently under active development. However it is feature complete with respect to the Router, and today could be put into production use. Current development effort is focused on adding support for a easy to use State management store for seamless data access. Persistence using SQLite3 as the default "__embedded__" database engine, with a plug-in architecture for other DB engines.

## BOM - Bill of Material

The following tools, technologies and software was used in the development of Furi (v0.1.4).

Item | Version | Description
--- | --- | ---
TypeScript | 5.7.3 | A super-set of JavaScript that adds static typing and other features to the language.
node | 22 LTS | Node.js core APIs.
yaml | 2.7.0 | A library for parsing YAML used to read Furi configuration file.
mime-types|2.1.35| The ultimate javascript content-type utility.
@deno/dnt | 0.41.3 | A tool for building NPM packages.
@std/assert | 1.0.11 | Deno standard library for assertions, used in test code.
Deno | 2.2.1 | A runtime environment for JavaScript that aims to be secure and fast.
Node.js | 20.18.3 LTS | The runtime environment for JavaScript.
Linux | 6.13.1-1-default | openSUSE Tumbleweed with KDE desktop

__NOTE__: See Changelog for additional details on changes and updates. ✅

## Example source code

You can find example source code at the [GitHib furi-examples repository](https://github.com/rajinder-yadav/furi-examples).

You can download the example source use using git:

```sh
git clone https://github.com/rajinder-yadav/furi-examples.git
```

The examples are easy to follow and should give you to a good understanding of how to use the Furi framework.

Most of the Typescript examples will require you to install and use Deno to run them.
The first example in directory, "01-simple-js-node" shows you how to use Node.js with plain JavaScript.
The examples are number to help you quick start from basic and move to advanced usage.

## Coding with JavaScript

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

## Startup message

When you run the server application, you will see a similar output in your terminal:

```sh
Furi Server (v0.8.0) started.
Server  { mode: http, host: localhost, port: 3030, env: development }
Runtime { deno: 2.2.4, v8: 13.4.114.11-rusty, typescript: 5.7.3 }
Logger  { enable: true, level: DEBUG, logFile: furi.log, mode: stream, flushPeriod: 1000ms, maxCount: 100 }
```

This can help you quickly identify that your server is running, configuration settings and the runtime environment details.

## Declare a named route

The code below shows how to declare a named route, and also how to read the named route parameters from the handler function, using the `ApplicationContext` object.

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

Below we declare a route handler on a router, then we mouth the router to the Furi instance.

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
router.use((ctx: ApplicationContext, next: Middleware) => {
  ctx.send('Top-level Middleware 1\n');
  next();
});
router.use((ctx: ApplicationContext, next: Middleware) => {
  ctx.send('Top-level Middleware 2\n');
  next();
});
```

### Declaring route based middlewares

```ts
router.get('/home', (ctx: ApplicationContext, next: Middleware) => {
  ctx.send('Middleware 1\n');
  next();
});
router.get('/home', (ctx: ApplicationContext, next: Middleware) => {
  ctx.send('Middleware 2\n');
  next();
});
router.get('/home', (ctx: ApplicationContext, next: Middleware) => {
  ctx.send('<h1>Home Page</h1>\n');
  ctx.end('<p>Welcome to the home page.</p>\n');
});
```

## Supported middlewares

Furi currently support the following core middlewares:

1. Body parser
2. Cors
3. Web

Documentation forth coming once I have time to write it.

## Array based routing

Furi now supports array based routes. You declare one or more routes in the "routes" array.

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
      controller: (ctx: ApplicationContext, next: Middleware) => {
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
function myMiddleware(ctx: ApplicationContext, next: Middleware) {
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
      controller: (ctx: ApplicationContext, next: Middleware) => {
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
      controller: (ctx: ApplicationContext, next: Middleware) => {
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
        (ctx: ApplicationContext, next: Middleware) => {
          ctx.response.writeHead(200, {
            'Content-Type': 'text/html',
            'User-Agent': USER_AGENT
          });
          ctx.send('Middleware Pre!\n');
          next();
        },
        (ctx: ApplicationContext, next: Middleware) => {
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

## Server Configuration file

Furi lets you configure server settings from a YAML file. This allows you to easily change settings without having to modify your code.

Currently the configurable setting can control. All these settings are optional.

1. Server start up properties.
1. Logging properties.
1. HTTPS properties.

## Configuration file

The server configuration must be called, "furi.yaml" or "furi.yml" and placed under the project root directory.

If you configuration file is found, Furi will use sensible defaults.

__File: "furi.yaml" (optional)__

## Server properties

This configuration control the server startup properties.

```yaml
server:
  port: 3030
  host: localhost
  env: development
```

## Super fast stream logging ⚡

Furi supports fist-class logging at the core. Logging is fast and takes place on a background worker-thread, so the main thread never blocks. Logging can be buffered, or immediately written to file. Logging behavior can be configured in Furi's configuration YAML file.

Logging uses the latest Node.js features. Since logging is the core functionality of Furi, there is very little code overhead compared to existing logging libraries.

Note file logging is disabled by default, you must enable it in Furi YAML configuration file.

### Logger configuration

Here are the configurable logging options:

- __flushPeriod__: Control time to flush buffered log messages.
- __maxCount__: Maximum number of log messages before flushing.
- __mode__: Can be one of "stream" or "buffer".
- __level__: Can be one of "debug", "info", "log", "warn", "error", "critical" or "fatal".

The level is used to filter log messages based on their severity. Only messages at or above the configured level will be logged.

If you do not declare any logger settings, the following are the default setting values:

```yaml
logger:
  enable: false
  flushPeriod: 1000
  logFile: furi.log
  maxCount: 100
  mode: buffer
  level: info
```

To enable logging you only need to change one setting:

```yaml
logger:
  enable: true
```

This will result in buffered logging, if you want to view immediate logging, you can switch to stream mode:

```yaml
logger:
  enable: true
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

## Enabling HTTPS Support

Furi makes it easy to spin-up a HTTPS server. You do not need to code this up manually in your server application code.

Furi is started with HTTPS support by providing the path to the SSL key and certificate files in the"__furi.yaml__" server configuration file.

You must declare the properties under the "__cert__" section as follows:

### Using a SSL certificate

Here is how you would start Furi with HTTPS:

```yaml
cert:
  key: ./ssl/key.pem
  cert: ./ssl/cert.pem
```

### Using a SSL certificate with a passphrase

```yaml
cert:
  key:  ./ssl/key.pem
  cert: ./ssl/cert.pem
  passphrase: hello123
```

When Furi is running under HTTPS, it will shows in the log and startup message. You will see "__mode: https" under Server.

```sh
Furi Server (v0.8.0) started.
Server  { mode: https, host: localhost, port: 3030, env: development }
Runtime { deno: 2.2.4, v8: 13.4.114.11-rusty, typescript: 5.7.3 }
Logger  { enable: true, level: DEBUG, logFile: furi.log, mode: stream, flushPeriod: 1000ms, maxCount: 100 }
```

### Sample log output

```txt
2025-03-02T21:33:03.426Z, INFO, Furi Server (v0.2.4) started.
2025-03-02T21:33:03.427Z, INFO, Server { host: localhost, port: 3030, mode: development }
2025-03-02T21:33:03.427Z, INFO, Runtime { deno: 2.2.2, v8: 13.4.114.9-rusty, typescript: 5.7.3 }
2025-03-02T21:33:03.428Z, INFO, Logger { enable: true, level: INFO, logFile: furi.log, mode: stream, flushPeriod: 1000ms, maxCount: 100 }
2025-03-02T21:33:12.216Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 47052, http: 1.1, method: GET, url: /
2025-03-02T21:33:12.230Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 47056, http: 1.1, method: GET, url: /
2025-03-02T21:33:12.232Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 47068, http: 1.1, method: GET, url: /about
2025-03-02T21:33:12.233Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 47070, http: 1.1, method: GET, url: /about/
2025-03-02T21:33:12.234Z, INFO, host: localhost:3030, remote-ip: 127.0.0.1, remote-port: 47072, http: 1.1, method: GET, url: /about/raj12
```

## Motivation

![Image](./images/octopus.jpeg)

The primary objective of the Furi project is to provide a fast, small HTTP server that runs on small hardware with low memory. This benefits micro-architect environments with scaling and performance, with faster load time, compact footprint to maximize bigger production workloads.

The guiding principle of the project is to have the code base self contain with no external dependencies. This allows for easy deployment and maintenance on any platform that supports Node.js. The aim is for small independent shops to be able to run a production server and website while keeping the cost down substantially, along with the effort to maintain the setup.

## Why

A fast, responsive and lightweight framework that is easy to use. Furi keeps your code simple, avoids useless abstraction and does not get in the way with working with Node.js core APIs should you ever need to.

Inspired by Express.js and Koa.

## Benchmarks 🚀

Furi outperformed both Fastify and Express.js 5.0 in a benchmark test.
Below are the benchmarks results.

1. Number of requests made: 100,000
1. Total time taken in seconds.
1. Requests handled in 1 second.

Framework | Requests | Total Time | Requests handled / sec
-|-|-|-
Furi | 100,000 | 11.569 s | 8643.74
Fastify | 100,000 | 13.847 s | 7221.62
Express.js v5.0 | 100,000 | 18.020 s | 5549.29

### Furi Benchmark

![Furi](./images/furi-benchmark.png)

### Fastify Benchmark

![Fastify](./images/fastify-benchmark.png)

### Express Benchmark

![Express](./images/express-benchmarks.png)
