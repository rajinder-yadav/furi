/**
 * How to run this test in isolation:
 * deno test -A --env-file test/application-context.test.ts
 */
import { Socket } from "node:net";
import { assertEquals, assertNotEquals, assertFalse } from '@std/assert';

import {
  ApplicationContext,
  Furi,
  HttpRequest,
  HttpResponse,
  MapOf,
  QueryParamTypes,
} from '../../lib/furi.ts';

Deno.test("ApplicationContext: check for valid app object", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  assertEquals(appContext.app, furi);
});

Deno.test("ApplicationContext::queryStringToObject simple", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject();

  // All values should be strings.
  assertNotEquals(result, null);
  assertEquals(result?.name, 'John');
  assertEquals(result?.age, "30");
  assertEquals(result?.hobbies, ['reading', 'traveling']);
});

Deno.test("ApplicationContext::queryStringToObject not simple", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject(false);

  // Values can should be string or number.
  assertNotEquals(result, null);
  assertEquals(result?.name, 'John');
  assertEquals(result?.age, 30);
  assertEquals(result?.hobbies, ['reading', 'traveling']);
});

Deno.test("ApplicationContext::sessionState string values", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
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

Deno.test("ApplicationContext::sessionState number values", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("count"));
  assertFalse(appContext.sessionState("balance"));

  appContext.sessionState("count", 12);
  appContext.sessionState("balance", 0.123);

  assertEquals(appContext.sessionState("count"), 12);
  assertEquals(appContext.sessionState("balance"), 0.123);

  assertNotEquals(appContext.sessionState("count"), "12");
  assertNotEquals(appContext.sessionState("balance"), "0.123");
});

Deno.test("ApplicationContext::sessionState update value", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("count"));
  appContext.sessionState("count", 12);
  assertEquals(appContext.sessionState("count"), 12);

  appContext.sessionState("count", 73);
  assertEquals(appContext.sessionState("count"), 73);
});

Deno.test("ApplicationContext::sessionState across calls", async () => {
  const furi = new Furi();
  const httpRequest1 = new HttpRequest(new Socket());
  const httpResponse1 = new HttpResponse(httpRequest1);

  const appContext1 = new ApplicationContext(furi, httpRequest1, httpResponse1);
  assertFalse(appContext1.sessionState("count"));
  appContext1.sessionState("count", 12);
  assertEquals(appContext1.sessionState("count"), 12);

  const httpRequest2 = new HttpRequest(new Socket());
  const httpResponse2 = new HttpResponse(httpRequest1);
  const appContext2 = new ApplicationContext(furi, httpRequest2, httpResponse2);
  assertNotEquals(appContext2.sessionState("count"), 12);
  assertFalse(appContext2.sessionState("count"));

});

Deno.test("ApplicationContext::storeState values", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  assertFalse(appContext.storeState("count"));
  appContext.storeState("count", 12);
  assertEquals(appContext.storeState("count"), 12);

  assertFalse(appContext.storeState("item"));
  appContext.storeState("item", "radio");
  assertEquals(appContext.storeState("item"), "radio");
});

Deno.test("ApplicationContext::storeState across calls", async () => {
  const furi = new Furi();
  const httpRequest1 = new HttpRequest(new Socket());
  const httpResponse1 = new HttpResponse(httpRequest1);

  const appContext1 = new ApplicationContext(furi, httpRequest1, httpResponse1);
  assertFalse(appContext1.storeState("count2"));
  appContext1.storeState("count", 12);
  assertEquals(appContext1.storeState("count"), 12);

  const httpRequest2 = new HttpRequest(new Socket());
  const httpResponse2 = new HttpResponse(httpRequest1);
  const appContext2 = new ApplicationContext(furi, httpRequest2, httpResponse2);
  assertEquals(appContext2.storeState("count"), 12);

});

/**
 * To do: Working with Cookies, and completed cookies test cases.
 * To do: Working with Cookies, and completed cookies test cases.
 * To do: Working with Cookies, and completed cookies test cases.
 */
Deno.test("ApplicationContext::cookies", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);

  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  assertEquals("","TO DO: cookie");

});

Deno.test("ApplicationContext::requestHeader", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  // We need an initialized request headers for this test to pass.
  httpRequest.headers = {};
  appContext.requestHeader("content-type", "application/json");
  appContext.requestHeader("authorization", "Bearer token");
  assertEquals(appContext.requestHeader("content-type"), "application/json");
  assertEquals(appContext.requestHeader("authorization"), "Bearer token");
});

Deno.test("ApplicationContext::responseHeader", async () => {
  const furi = new Furi();
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const appContext = new ApplicationContext(furi, httpRequest, httpResponse);
  appContext.responseHeader("content-type", "application/json");
  appContext.responseHeader("authorization", "Bearer token");
  assertEquals(appContext.responseHeader("content-type"), "application/json");
  assertEquals(appContext.responseHeader("authorization"), "Bearer token");
});
