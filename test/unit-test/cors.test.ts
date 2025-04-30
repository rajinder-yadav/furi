import { Socket } from "node:net";

import test from 'node:test';
import assert from 'node:assert/strict'

import {
  ApplicationContext,
  Cors,
  CorsOptions,
  Furi,
  FuriRequest,
  FuriResponse,
} from '../../lib/furi';



test('Cors default values', (t) => {
  const corsMiddleware = Cors();
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set origin', (t) => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "https://example.com");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set two origins', (t) => {
  const corsOptions:CorsOptions = {
    origin: ["http://localhost:3030", "https://example.com"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1.includes("https://example.com"), true);
  assert.equal(c1.includes("http://localhost:3030"), true);
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set origin, methods', (t) => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
    methods: ["GET", "POST"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "https://example.com");
  assert.equal(c2, "GET, POST");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set origin, methods, headers', (t) => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
    methods: ["GET", "PUT"],
    headers: ["Content-Type"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "https://example.com");
  assert.equal(c2, "GET, PUT");
  assert.equal(c3, "Content-Type");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set methods', (t) => {
  const corsOptions:CorsOptions = {
    methods: ["GET", "PUT"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, PUT");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set headers', (t) => {
  const corsOptions:CorsOptions = {
    headers: ["Authorization"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set credentials true', (t) => {
  const corsOptions:CorsOptions = {
    credentials: true
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "true");
  assert.equal(c5, "86400");
});

test('Cors set credentials false', (t) => {
  const corsOptions:CorsOptions = {
    credentials: false
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test('Cors set credentials max age', (t) => {
  const corsOptions:CorsOptions = {
    maxAge: 1212
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "1212");
});
