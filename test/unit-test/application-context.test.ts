/**
 * How to run this test in isolation:
 * deno test -A --env-file test/application-context.test.ts
 */
import { Socket } from "node:net";
import {
  assertEquals,
  assertNotEquals,
  assertFalse,
  assertInstanceOf,
  assertObjectMatch,
  assertExists
} from '@std/assert';

import {
  ApplicationContext,
  Furi,
  HttpCookiesStore,
  FuriRequest,
  FuriResponse,
  MapOf,
  QueryParamTypes,
} from '../../lib/furi.ts';

Deno.test("ApplicationContext: check for valid app object", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  assertInstanceOf(appContext, ApplicationContext, 'ApplicationContext: error')

});

Deno.test("ApplicationContext::queryStringToObject simple", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
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
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject(false);

  // Values can should be string or number.
  assertNotEquals(result, null);
  assertEquals(result?.name, 'John');
  assertEquals(result?.age, 30);
  assertEquals(result?.hobbies, ['reading', 'traveling']);
});

Deno.test("ApplicationContext sessionData is empty", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertObjectMatch(appContext.request.sessionData, {});
});

Deno.test("ApplicationContext::sessionState string values", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

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
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

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
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.sessionState("count"));
  appContext.sessionState("count", 12);
  assertEquals(appContext.sessionState("count"), 12);

  appContext.sessionState("count", 73);
  assertEquals(appContext.sessionState("count"), 73);
});

Deno.test("ApplicationContext::sessionState across calls", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext1 = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext1.sessionState("count"));
  appContext1.sessionState("count", 12);
  assertEquals(appContext1.sessionState("count"), 12);

  const httpRequest2 = new FuriRequest(new Socket());
  const httpResponse2 = new FuriResponse(httpRequest1);
  const appContext2 = new ApplicationContext(Furi.appStore, httpRequest2, httpResponse2);
  assertNotEquals(appContext2.sessionState("count"), 12);
  assertFalse(appContext2.sessionState("count"));

});

Deno.test("ApplicationContext::storeState values", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertFalse(appContext.storeState("count"));
  appContext.storeState("count", "12");
  assertEquals(appContext.storeState("count"), "12");

  assertFalse(appContext.storeState("item"));
  appContext.storeState("item", "radio");
  assertEquals(appContext.storeState("item"), "radio");
});

Deno.test("ApplicationContext::storeState across calls", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertExists(appContext.storeState("count"));
  assertEquals(appContext.storeState("count"), "12");
  appContext.storeState("item", "radio");
  assertEquals(appContext.storeState("item"), "radio");
});

Deno.test("ApplicationContext::storeState delete value", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertExists(appContext.storeState("count"));
  assertEquals(appContext.storeState("count"), "12");
  appContext.appStore.storeStateDelete("count");
  assertFalse(appContext.storeState("count"));

  appContext.storeState("item", "radio");
  assertEquals(appContext.storeState("item"), "radio");
  appContext.appStore.storeStateDelete("item");
  assertFalse(appContext.storeState("item"));
});

Deno.test("ApplicationContext::storeState delete value that does not exit", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("counter"));
  appContext.appStore.storeStateDelete("counter");
  assertFalse(appContext.storeState("counter"));
});

Deno.test("ApplicationContext::storeState double insert", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("count"));
  appContext.storeState("count", "12");
  assertEquals(appContext.storeState("count"), "12");
  appContext.storeState("count", "1212");
  assertEquals(appContext.storeState("count"), "1212");
});

Deno.test("ApplicationContext::storeState double delete", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertExists(appContext.storeState("count"));
  appContext.storeState("count", "1212");
  appContext.appStore.storeStateDelete("count");
  appContext.appStore.storeStateDelete("count");
  assertFalse(appContext.storeState("count"));
});


Deno.test("ApplicationContext::storeState reset and reset", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
  appContext.storeState("count", "12");
  appContext.storeState("role", "admin");
  assertEquals(appContext.storeState("count"), "12");
  assertEquals(appContext.storeState("role"), "admin");

  // Reset the state.
  appContext.appStore.storeStateReset();
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
});

Deno.test("ApplicationContext::storeState reset and double reset", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
  appContext.storeState("count", "12");
  appContext.storeState("role", "admin");
  assertEquals(appContext.storeState("count"), "12");
  assertEquals(appContext.storeState("role"), "admin");

  // Reset the state.
  appContext.appStore.storeStateReset();
  appContext.appStore.storeStateReset();
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
});

Deno.test("ApplicationContext::storeState reset and double reset then delete", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
  appContext.storeState("count", "12");
  appContext.storeState("role", "admin");
  assertEquals(appContext.storeState("count"), "12");
  assertEquals(appContext.storeState("role"), "admin");

  // Reset the state.
  appContext.appStore.storeStateReset();
  appContext.appStore.storeStateReset();
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));

  appContext.appStore.storeStateDelete("count");
  appContext.appStore.storeStateDelete("role");
});

Deno.test("ApplicationContext::storeState user helper methods", () => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));
  assertFalse(appContext.storeState("user"));
  appContext.storeState("count", "12");
  appContext.storeState("role", "admin");
  appContext.storeState("user", "yadav");
  assertEquals(appContext.storeState("count"), "12");
  assertEquals(appContext.storeState("role"), "admin");
  assertEquals(appContext.storeState("user"), "yadav");

  appContext.storeStateDelete("user");
  assertFalse(appContext.storeState("user"));

  appContext.storeStateDelete("user");
  appContext.storeStateDelete("user");

  // Reset the state.
  appContext.storeStateReset();
  appContext.storeStateReset();
  assertFalse(appContext.storeState("count"));
  assertFalse(appContext.storeState("role"));

  appContext.storeStateDelete("count");
  appContext.storeStateDelete("role");
});

Deno.test("ApplicationContext::cookies", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
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
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  // We need an initialized request headers for this test to pass.
  httpRequest.headers = {};
  appContext.requestHeader("content-type", "application/json");
  appContext.requestHeader("authorization", "Bearer token");
  assertEquals(appContext.requestHeader("content-type"), "application/json");
  assertEquals(appContext.requestHeader("authorization"), "Bearer token");
});

Deno.test("ApplicationContext::responseHeader", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  appContext.responseHeader("content-type", "application/json");
  appContext.responseHeader("authorization", "Bearer token");
  assertEquals(appContext.responseHeader("content-type"), "application/json");
  assertEquals(appContext.responseHeader("authorization"), "Bearer token");
});

Deno.test("ApplicationContext asyncResponseTimerId", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertEquals(appContext.asyncResponseTimerId, null);
});

Deno.test("ApplicationContext stopAsyncResponseTimer", () => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assertEquals(appContext.asyncResponseTimerId, null);
  appContext.startAsyncResponseTimer(1000);
  assertNotEquals(appContext.asyncResponseTimerId, null);
  appContext.stopAsyncResponseTimer();
  assertEquals(appContext.asyncResponseTimerId, null);
});

// Deno.test("ApplicationContext getCookie", () => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

//   assertEquals (appContext.getCookie(), undefined);
// });
