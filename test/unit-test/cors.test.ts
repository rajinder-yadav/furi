import { Socket } from "node:net";

import {
  assertEquals,
} from '@std/assert';

import {
  ApplicationContext,
  Cors,
  CorsOptions,
  Furi,
  HttpRequest,
  HttpResponse,
} from '../../lib/furi.ts';



Deno.test('Cors default values', () => {
  const corsMiddleware = Cors();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set origin', () => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "https://example.com");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set two origins', () => {
  const corsOptions:CorsOptions = {
    origin: ["http://localhost:3030", "https://example.com"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1.includes("https://example.com"), true);
  assertEquals(c1.includes("http://localhost:3030"), true);
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set origin, methods', () => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
    methods: ["GET", "POST"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "https://example.com");
  assertEquals(c2, "GET, POST");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set origin, methods, headers', () => {
  const corsOptions:CorsOptions = {
    origin: "https://example.com",
    methods: ["GET", "PUT"],
    headers: ["Content-Type"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "https://example.com");
  assertEquals(c2, "GET, PUT");
  assertEquals(c3, "Content-Type");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set methods', () => {
  const corsOptions:CorsOptions = {
    methods: ["GET", "PUT"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, PUT");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set headers', () => {
  const corsOptions:CorsOptions = {
    headers: ["Authorization"],
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set credentials true', () => {
  const corsOptions:CorsOptions = {
    credentials: true
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "true");
  assertEquals(c5, "86400");
});

Deno.test('Cors set credentials false', () => {
  const corsOptions:CorsOptions = {
    credentials: false
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "86400");
});

Deno.test('Cors set credentials max age', () => {
  const corsOptions:CorsOptions = {
    maxAge: 1212
  };

  const corsMiddleware = Cors(corsOptions);
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  ctx.request.method = 'OPTIONS';
  corsMiddleware(ctx, () => {});

  const c1 = ctx.response.getHeader("Access-Control-Allow-Origin") as string;
  const c2 = ctx.response.getHeader("Access-Control-Allow-Methods");
  const c3 = ctx.response.getHeader("Access-Control-Allow-Headers");
  const c4 = ctx.response.getHeader("Access-Control-Allow-Credentials");
  const c5 = ctx.response.getHeader("Access-Control-Max-Age");

  assertEquals(c1, "http://localhost:3030");
  assertEquals(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assertEquals(c3, "Content-Type, Authorization");
  assertEquals(c4, "false");
  assertEquals(c5, "1212");
});
