/**
 * How to run this test in isolation:
 * deno test -A --env-file test/application-context.test.ts
 */
import { Socket } from "node:net";

import test from 'node:test';
import assert from 'node:assert/strict'

import {
  ApplicationContext,
  Furi,
  // HttpCookiesStore,
  FuriRequest,
  FuriResponse,
  MapOf,
  QueryParamTypes,
} from '../../lib/furi';

function isArrayIncluded<T>(a1: T[], a2: T[]) {
  return a1.every(e => a2.includes(e));
}

test("ApplicationContext: check for valid app object", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  assert.ok(appContext instanceof ApplicationContext, 'ApplicationContext: error')

});

test("ApplicationContext::queryStringToObject simple", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject();

  // All values should be strings.
  assert.notEqual(result, null);
  assert.equal(result?.name, 'John');
  assert.equal(result?.age, "30");
  assert.ok(isArrayIncluded(result?.hobbies as string[], ['reading', 'traveling']));
});

test("ApplicationContext::queryStringToObject not simple", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  httpRequest.query = new URLSearchParams('name=John&age=30&hobbies=reading,traveling');
  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const result: MapOf<QueryParamTypes> | null = appContext.queryStringToObject(false);

  // Values can should be string or number.
  assert.notEqual(result, null);
  assert.equal(result?.name, 'John');
  assert.equal(result?.age, 30);
  assert.ok(isArrayIncluded(result?.hobbies as string[], ['reading', 'traveling']));
});

test("ApplicationContext sessionData is empty", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assert.deepStrictEqual(appContext.request.sessionData, {});
});

test("ApplicationContext::sessionState string values", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assert.ok(!appContext.sessionState("animal"));
  assert.ok(!appContext.sessionState("colour"));
  assert.ok(!appContext.sessionState("planet"));

  appContext.sessionState("animal", "donkey");
  appContext.sessionState("colour", "red");
  appContext.sessionState("planet", "earth");

  assert.equal(appContext.sessionState("animal"), "donkey");
  assert.equal(appContext.sessionState("colour"), "red");
  assert.equal(appContext.sessionState("planet"), "earth");

  assert.notEqual(appContext.sessionState("number"), "12");
});

test("ApplicationContext::sessionState number values", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assert.ok(!appContext.sessionState("count"));
  assert.ok(!appContext.sessionState("balance"));

  appContext.sessionState("count", 12);
  appContext.sessionState("balance", 0.123);

  assert.equal(appContext.sessionState("count"), 12);
  assert.equal(appContext.sessionState("balance"), 0.123);

  assert.notEqual(appContext.sessionState("count"), "12");
  assert.notEqual(appContext.sessionState("balance"), "0.123");
});

test("ApplicationContext::sessionState update value", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assert.ok(!appContext.sessionState("count"));
  appContext.sessionState("count", 12);
  assert.equal(appContext.sessionState("count"), 12);

  appContext.sessionState("count", 73);
  assert.equal(appContext.sessionState("count"), 73);
});

test("ApplicationContext::sessionState across calls", (t) => {
  const httpRequest1 = new FuriRequest(new Socket());
  const httpResponse1 = new FuriResponse(httpRequest1);

  const appContext1 = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
  assert.ok(!appContext1.sessionState("count"));
  appContext1.sessionState("count", 12);
  assert.equal(appContext1.sessionState("count"), 12);

  const httpRequest2 = new FuriRequest(new Socket());
  const httpResponse2 = new FuriResponse(httpRequest1);
  const appContext2 = new ApplicationContext(Furi.appStore, httpRequest2, httpResponse2);
  assert.notEqual(appContext2.sessionState("count"), 12);
  assert.ok(!appContext2.sessionState("count"));

});

test("ApplicationContext::storeState values", (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);

  const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
  assert.ok(!appContext.storeState("count"));
  appContext.storeState("count", 12);
  assert.equal(appContext.storeState("count"), 12);

  assert.ok(!appContext.storeState("item"));
  appContext.storeState("item", "radio");
  assert.equal(appContext.storeState("item"), "radio");
});

// test("ApplicationContext::storeState across calls", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(appContext.storeState("count"));
//   assert.equal(appContext.storeState("count"), 12);
//   appContext.storeState("item", "radio");
//   assert.equal(appContext.storeState("item"), "radio");
// });

// test("ApplicationContext::storeState delete value", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(appContext.storeState("count"));
//   assert.equal(appContext.storeState("count"), 12);
//   appContext.appStore.storeStateDelete("count");
//   assert.ok(!appContext.storeState("count"));

//   appContext.storeState("item", "radio");
//   assert.equal(appContext.storeState("item"), "radio");
//   appContext.appStore.storeStateDelete("item");
//   assert.ok(!appContext.storeState("item"));
// });

// test("ApplicationContext::storeState delete value that does not exit", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("counter"));
//   appContext.appStore.storeStateDelete("counter");
//   assert.ok(!appContext.storeState("counter"));
// });

// test("ApplicationContext::storeState double insert", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("count"));
//   appContext.storeState("count", 12);
//   assert.equal(appContext.storeState("count"), 12);
//   appContext.storeState("count", 1212);
//   assert.equal(appContext.storeState("count"), 1212);
// });

// test("ApplicationContext::storeState double delete", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(appContext.storeState("count"));
//   appContext.storeState("count", "1212");
//   appContext.appStore.storeStateDelete("count");
//   appContext.appStore.storeStateDelete("count");
//   assert.ok(!appContext.storeState("count"));
// });


// test("ApplicationContext::storeState reset and reset", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
//   appContext.storeState("count", "12");
//   appContext.storeState("role", "admin");
//   assert.equal(appContext.storeState("count"), "12");
//   assert.equal(appContext.storeState("role"), "admin");

//   // Reset the state.
//   appContext.appStore.storeStateReset();
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
// });

// test("ApplicationContext::storeState reset and double reset", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
//   appContext.storeState("count", "12");
//   appContext.storeState("role", "admin");
//   assert.equal(appContext.storeState("count"), "12");
//   assert.equal(appContext.storeState("role"), "admin");

//   // Reset the state.
//   appContext.appStore.storeStateReset();
//   appContext.appStore.storeStateReset();
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
// });

// test("ApplicationContext::storeState reset and double reset then delete", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
//   appContext.storeState("count", "12");
//   appContext.storeState("role", "admin");
//   assert.equal(appContext.storeState("count"), "12");
//   assert.equal(appContext.storeState("role"), "admin");

//   // Reset the state.
//   appContext.appStore.storeStateReset();
//   appContext.appStore.storeStateReset();
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));

//   appContext.appStore.storeStateDelete("count");
//   appContext.appStore.storeStateDelete("role");
// });

// test("ApplicationContext::storeState user helper methods", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));
//   assert.ok(!appContext.storeState("user"));
//   appContext.storeState("count", "12");
//   appContext.storeState("role", "admin");
//   appContext.storeState("user", "yadav");
//   assert.equal(appContext.storeState("count"), "12");
//   assert.equal(appContext.storeState("role"), "admin");
//   assert.equal(appContext.storeState("user"), "yadav");

//   appContext.storeStateDelete("user");
//   assert.ok(!appContext.storeState("user"));

//   appContext.storeStateDelete("user");
//   appContext.storeStateDelete("user");

//   // Reset the state.
//   appContext.storeStateReset();
//   appContext.storeStateReset();
//   assert.ok(!appContext.storeState("count"));
//   assert.ok(!appContext.storeState("role"));

//   appContext.storeStateDelete("count");
//   appContext.storeStateDelete("role");
// });

// test("ApplicationContext::storeState save string", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", "12");
//   assert.equal(appContext.storeState("value"), "12");
// });

// test("ApplicationContext::storeState save number hex", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", 0x12ae);
//   assert.equal(appContext.storeState("value"), 0x12ae);
// });

// test("ApplicationContext::storeState save number octal", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", 0o435);
//   assert.equal(appContext.storeState("value"), 0o435);
// });

// test("ApplicationContext::storeState save number binary", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", 0b10101010);
//   assert.equal(appContext.storeState("value"), 0b10101010);
// });

// test("ApplicationContext::storeState save number integer positve", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", 12);
//   assert.equal(appContext.storeState("value"), 12);
// });

// test("ApplicationContext::storeState save number integer negative", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", -12);
//   assert.equal(appContext.storeState("value"), -12);
// });

// test("ApplicationContext::storeState save number float positive", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", 12.345);
//   assert.equal(appContext.storeState("value"), 12.345);
// });

// test("ApplicationContext::storeState save number float negative", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", -12.345);
//   assert.equal(appContext.storeState("value"), -12.345);
// });

// test("ApplicationContext::storeState save number Infinity", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", Infinity);
//   assert.equal(appContext.storeState("value"), Infinity);
// });

// test("ApplicationContext::storeState save number -Infinity", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", -Infinity);
//   assert.equal(appContext.storeState("value"), -Infinity);
// });

// test("ApplicationContext::storeState save number NaN", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", NaN);
//   assert.equal(appContext.storeState("value"), NaN);
// });

// test("ApplicationContext::storeState save number BigInt", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt(9007199254740991n));
//   assert.equal(appContext.storeState("value"), BigInt(9007199254740991n));
// });

// test("ApplicationContext::storeState save BigInt as string", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt("9007199254740991"));
//   assert.equal(appContext.storeState("value"), BigInt(9007199254740991));
// });

// test("ApplicationContext::storeState save BigInt as octal", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt("0o377777777777777777"));
//   assert.equal(appContext.storeState("value"), BigInt(0o377777777777777777));
// });

// test("ApplicationContext::storeState save BigInt as binary", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt("0b11111111111111111111111111111111111111111111111111111"));
//   assert.equal(appContext.storeState("value"), BigInt("0b11111111111111111111111111111111111111111111111111111"));
// });

// test("ApplicationContext::storeState save BigInt as binary", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt("0b11111111111111111111111111111111111111111111111111111"));
//   assert.equal(appContext.storeState("value"), BigInt(0b11111111111111111111111111111111111111111111111111111));
// });

// test("ApplicationContext::storeState save BigInt as hex", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", BigInt("0x1fffffffffffff"));
//   assert.equal(appContext.storeState("value"), BigInt(0x1fffffffffffff));
// });

// test("ApplicationContext::storeState save boolean true", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", true);
//   assert.equal(appContext.storeState("value"), true);
// });

// test("ApplicationContext::storeState save boolean false", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", false);
//   assert.equal(appContext.storeState("value"), false);
// });

// test("ApplicationContext::storeState save undefined", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", undefined);
//   assert.equal(appContext.storeState("value"), undefined);
// });

// test("ApplicationContext::storeState save null", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", null);
//   assert.equal(appContext.storeState("value"), null);
// });

// test("ApplicationContext::storeState save null", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();
//   appContext.storeState("value", null);
//   assert.equal(appContext.storeState("value"), null);
// });

// test("ApplicationContext::storeState save null", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();

//   const obj = { string: "string", number: 12.12, arr: [1, "moo", 54.3]};
//   appContext.storeState("value", obj);
//   const readObj = appContext.storeState("value");
//   assert.equal(readObj.string, "string");
//   assert.equal(readObj.number, 12.12);
//   // assertArrayIncludes(readObj.arr, [1, "moo", 54.3]);
// });

// test("ApplicationContext::storeState save array", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();

//   const obj = [1, "moo", 54.3, {name: "test", value: 567}];
//   appContext.storeState("value", obj);
//   const readObj = appContext.storeState("value");
//   assert.equal(readObj.length, 4);
//   // assertArrayIncludes(readObj, [1, "moo", 54.3]);
//   // assertArrayIncludes(readObj, [{name: "test", value: 567}]);
// });

// test("ApplicationContext::storeState save Date", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();

//   const obj = Date.now();
//   appContext.storeState("value", obj);
//   const readObj = appContext.storeState("value");
//   assert.equal(readObj, obj);
// });

// test("ApplicationContext::storeState save Date from a value", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();

//   const obj = new Date(8.64e15);
//   appContext.storeState("value", obj);
//   const readObj = appContext.storeState("value");
//   assert.equal(readObj, obj);
// });

// test("ApplicationContext::storeState save Date from a string", (t) => {
//   const httpRequest1 = new FuriRequest(new Socket());
//   const httpResponse1 = new FuriResponse(httpRequest1);

//   const appContext = new ApplicationContext(Furi.appStore, httpRequest1, httpResponse1);
//   appContext.storeStateReset();

//   const obj = new Date("December 17, 1995 03:24:00");
//   appContext.storeState("value", obj);
//   const readObj = appContext.storeState("value");
//   assert.equal(readObj, obj);
// });

// test("ApplicationContext::cookies", (t) => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

//   const store = new HttpCookiesStore();
//   store.cookie('name', 'yadav');
//   store.cookie('user', 'dev12');
//   store.setCookies(ctx);
//   const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
//   assert.equal(setCookies.includes('name=yadav'), true);
//   assert.equal(setCookies.includes('user=dev12'), true);
// });

// test("ApplicationContext::requestHeader", (t) => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
//   // We need an initialized request headers for this test to pass.
//   httpRequest.headers = {};
//   appContext.requestHeader("content-type", "application/json");
//   appContext.requestHeader("authorization", "Bearer token");
//   assert.equal(appContext.requestHeader("content-type"), "application/json");
//   assert.equal(appContext.requestHeader("authorization"), "Bearer token");
// });

// test("ApplicationContext::responseHeader", (t) => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
//   appContext.responseHeader("content-type", "application/json");
//   appContext.responseHeader("authorization", "Bearer token");
//   assert.equal(appContext.responseHeader("content-type"), "application/json");
//   assert.equal(appContext.responseHeader("authorization"), "Bearer token");
// });

// test("ApplicationContext asyncResponseTimerId", (t) => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
//   assert.equal(appContext.asyncResponseTimerId, null);
// });

// test("ApplicationContext stopAsyncResponseTimer", (t) => {
//   const httpRequest = new FuriRequest(new Socket());
//   const httpResponse = new FuriResponse(httpRequest);
//   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);
//   assert.equal(appContext.asyncResponseTimerId, null);
//   appContext.startAsyncResponseTimer(1000);
//   assert.notEqual(appContext.asyncResponseTimerId, null);
//   appContext.stopAsyncResponseTimer();
//   assert.equal(appContext.asyncResponseTimerId, null);
// });

// // test("ApplicationContext getCookie", (t) => {
// //   const httpRequest = new FuriRequest(new Socket());
// //   const httpResponse = new FuriResponse(httpRequest);
// //   const appContext = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

// //   assert.equal (appContext.getCookie(), undefined);
// // });
