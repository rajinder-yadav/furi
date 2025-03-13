/**
 * How to run this test in isolation:
 * deno test -A --env-file test/application-context.test.ts
 */
import { Socket } from "node:net";
import { assertEquals, assertNotEquals, assertFalse, assertInstanceOf } from '@std/assert';

import {
  ApplicationContext,
  Furi,
  HttpCookiesStore,
  HttpRequest,
  HttpResponse,
  MapOf,
  QueryParamTypes,
} from '../../lib/furi.ts';

Deno.test("ApplicationContext: check for valid app object", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  assertInstanceOf(appContext, ApplicationContext, 'ApplicationContext: error')

});

Deno.test("ApplicationContext::queryStringToObject simple", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject();

  // All values should be strings.
  assertNotEquals(result, null);
  assertEquals(result?.name, 'John');
  assertEquals(result?.age, "30");
  assertEquals(result?.hobbies, ['reading', 'traveling']);
});

Deno.test("ApplicationContext::queryStringToObject not simple", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject(false);

  // Values can should be string or number.
  assertNotEquals(result, null);
  assertEquals(result?.name, 'John');
  assertEquals(result?.age, 30);
  assertEquals(result?.hobbies, ['reading', 'traveling']);
});

Deno.test("ApplicationContext::sessionState string values", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("animal"));
  assertFalse(appContext.sessionState("colour"));
  assertFalse(appContext.sessionState("planet"));

  appContext.sessionState("animal", "donkey");
  appContext.sessionState("colour", "red");
  appContext.sessionState("planet", "earth");

  assertEquals(appContext.sessionState("animal"), "donkey");
  assertEquals(appContext.sessionState("colour"), "red");
  assertEquals(appContext.sessionState("planet"), "earth");

  assertNotEquals(appContext.sessionState("number"), "12");
});

Deno.test("ApplicationContext::sessionState number values", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("count"));
  assertFalse(appContext.sessionState("balance"));

  appContext.sessionState("count", 12);
  appContext.sessionState("balance", 0.123);

  assertEquals(appContext.sessionState("count"), 12);
  assertEquals(appContext.sessionState("balance"), 0.123);

  assertNotEquals(appContext.sessionState("count"), "12");
  assertNotEquals(appContext.sessionState("balance"), "0.123");
});

Deno.test("ApplicationContext::sessionState update value", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("count"));
  appContext.sessionState("count", 12);
  assertEquals(appContext.sessionState("count"), 12);

  appContext.sessionState("count", 73);
  assertEquals(appContext.sessionState("count"), 73);
});

Deno.test("ApplicationContext::sessionState across calls", () => {
  const httpRequest1 = new HttpRequest(new Socket());
  const httpResponse1 = new HttpResponse(httpRequest1);

  const appContext1 = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext1.sessionState("count"));
  appContext1.sessionState("count", 12);
  assertEquals(appContext1.sessionState("count"), 12);

  const httpRequest2 = new HttpRequest(new Socket());
  const httpResponse2 = new HttpResponse(httpRequest1);
  const appContext2 = new ApplicationContext(Furi.appStore, httpRequest2, httpResponse2);
  assertNotEquals(appContext2.sessionState("count"), 12);
  assertFalse(appContext2.sessionState("count"));

});

Deno.test("ApplicationContext::storeState values", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.storeState("count"));
  appContext.storeState("count", 12);
  assertEquals(appContext.storeState("count"), 12);

  assertFalse(appContext.storeState("item"));
  appContext.storeState("item", "radio");
  assertEquals(appContext.storeState("item"), "radio");
});

Deno.test("ApplicationContext::storeState across calls", () => {
  const httpRequest1 = new HttpRequest(new Socket());
  const httpResponse1 = new HttpResponse(httpRequest1);

  const appContext1 = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext1.storeState("count2"));
  appContext1.storeState("count", 12);
  assertEquals(appContext1.storeState("count"), 12);

  const httpRequest2 = new HttpRequest(new Socket());
  const httpResponse2 = new HttpResponse(httpRequest1);
  const appContext2 = new ApplicationContext(Furi.appStore, httpRequest2, httpResponse2);
  assertEquals(appContext2.storeState("count"), 12);
});

Deno.test("ApplicationContext::cookies", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.cookie('user', 'dev12');
  store.setCookies(ctx);
  const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
  assertEquals(setCookies.includes('name=yadav'), true);
  assertEquals(setCookies.includes('user=dev12'), true);
});

Deno.test("ApplicationContext::requestHeader", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  // We need an initialized request headers for this test to pass.
  httpRequest.headers = {};
  appContext.requestHeader("content-type", "application/json");
  appContext.requestHeader("authorization", "Bearer token");
  assertEquals(appContext.requestHeader("content-type"), "application/json");
  assertEquals(appContext.requestHeader("authorization"), "Bearer token");
});

Deno.test("ApplicationContext::responseHeader", () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  appContext.responseHeader("content-type", "application/json");
  appContext.responseHeader("authorization", "Bearer token");
  assertEquals(appContext.responseHeader("content-type"), "application/json");
  assertEquals(appContext.responseHeader("authorization"), "Bearer token");
});
