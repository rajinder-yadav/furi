/**
 * FURI - Fast Uniform Resource Identifier
 *
 * The Fast and Furious Node Router
 * Copyright(c) 2016 - 2025 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is releases as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import test from 'node:test';
import assert from 'node:assert/strict'

import {API_VERSION} from '../../lib/types';
const USER_AGENT: string = `Furi HTTP Node.js Server v${API_VERSION}`;

test("GET: Root path without end slash", async (t) => {
  const request = new Request("http://localhost:3030", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Root path with end slash", async (t) => {
  const request = new Request("http://localhost:3030/", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: About without end slash", async (t) => {
  const request = new Request("http://localhost:3030/about", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });

  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>About FURI</h1>\nThis is the about page.\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: About with end slash", async (t) => {
  const request = new Request("http://localhost:3030/about/", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>About FURI</h1>\nThis is the about page.\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: /about/raj12", async (t) => {
  const user_id = 'raj12';
  const request = new Request(`http://localhost:3030/about/${user_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: /about/raj12/", async (t) => {
  const user_id = 'raj12';
  const request = new Request(`http://localhost:3030/about/${user_id}/`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: /about/5612", async (t) => {
  const user_id = '5612';
  const request = new Request(`http://localhost:3030/about/${user_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: About with query string", async (t) => {
  const request = new Request("http://localhost:3030/about?s=45bnj34", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>About FURI</h1>\nThis is the about page.\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: About with end slash and query string", async (t) => {
  const request = new Request("http://localhost:3030/about/?we=394845hjh", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>About FURI</h1>\nThis is the about page.\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});


test("GET: /about/raj12?er=345o85", async (t) => {
  const user_id = 'raj12';
  const request = new Request(`http://localhost:3030/about/${user_id}?er=345o85`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: /about/raj12/?er=345o85", async (t) => {
  const user_id = 'raj12';
  const request = new Request(`http://localhost:3030/about/${user_id}/?er=345o85`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Root path with query string", async (t) => {
  const request = new Request("http://localhost:3030?q=dfjriour", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Root path with end slash and query string", async (t) => {
  const request = new Request("http://localhost:3030/?q=dfjriour", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: User id and photo id route segments", async (t) => {
  const user_id = '5612';
  const photo_id = 'drjr3494nd';
  const request = new Request(`http://localhost:3030/user/${user_id}/photo/${photo_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>User Photo Page!</h1>\nUser ${user_id} photo ${photo_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: User id and photo id route segments with trailing slash", async (t) => {
  const user_id = '5612';
  const photo_id = 'drjr3494nd';
  const request = new Request(`http://localhost:3030/user/${user_id}/photo/${photo_id}/`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>User Photo Page!</h1>\nUser ${user_id} photo ${photo_id}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Toronto Regex segmented path 1", async (t) => {
  const code = 'fd034j';
  const path = `/toronto/${code}/can`;
  const request = new Request(`http://localhost:3030${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Toronto Regex segmented path 2", async (t) => {
  const code = 'fd034j';
  const path = `/toronto/${code}/ca233n`;
  const request = new Request(`http://localhost:3030${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Toronto Regex segmented path 3", async (t) => {
  const code = 'fd034j';
  const path = `/torrronto/${code}/can`;
  const request = new Request(`http://localhost:3030${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Toronto Regex segmented path 4", async (t) => {
  const code = 'fd034j';
  const path = `/torrronto/${code}/ca1233n`;
  const request = new Request(`http://localhost:3030${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Chaining handlers", async (t) => {
  const request = new Request("http://localhost:3030/chain", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n<p>This paragraph is form handler 2</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Chaining handlers halting", async (t) => {
  const request = new Request("http://localhost:3030/chainhalt", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PATCH: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment", {
    method: "PATCH",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'PATCH a fresh comment.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PATCH: Comment how to route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment/how-to", {
    method: "PATCH",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'PATCH How to post a comment page.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PATCH: Comment how to route without a body", async (t) => {
  const request = new Request("http://localhost:3030/comment/how", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"message":"PATCH comment with id","id":"how","text":""}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PATCH: Comment how to route with a JSON body", async (t) => {
  const request = new Request("http://localhost:3030/comment/how", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text: "This is a test comment." }),
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"message":"PATCH comment with id","id":"how","text":{"text":"This is a test comment."}}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("POST: Comment how to route with a JSON body", async (t) => {
  const request = new Request("http://localhost:3030/comment", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
    body: JSON.stringify({ text: "This is a test comment." }),
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'POST a fresh comment.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("POST: Comment how to route", async (t) => {
  const request = new Request("http://localhost:3030/comment/how-to", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'POST How to post a comment page.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("POST: Comment how to route with empty body", async (t) => {
  const request = new Request("http://localhost:3030/comment/how", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);


  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"message":"POST comment with id","id":"how","text":""}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PUT: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'PUT a fresh comment.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PUT: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment/how-to", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'PUT How to post a comment page.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("PUT: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment/how", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'PUT comment with id: how';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("DELETE: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'DELETE a comment.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("DELETE: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment/how-to", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'DELETE How to post a comment page.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("DELETE: Comment route without end slash", async (t) => {
  const request = new Request("http://localhost:3030/comment/how", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'DELETE comment with id: how';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Middleware 1 end processing early", async (t) => {
  const request = new Request("http://localhost:3030/middleware", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'About page Middleware 1\nAbout page Middleware 2\n';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Middleware 2 pre, main, post", async (t) => {
  const request = new Request("http://localhost:3030/middleware2", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<p>Middleware 2 pre</p>\n<p>Middleware 2 GET </p>\n<p>Middleware 2 post </p>\n';
  const data = await response.text();
  assert.equal(data, s);
});


test("GET: Query paramter check 1", async (t) => {
  const request = new Request("http://localhost:3030/query-check?q=dfjriour", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"q":"dfjriour"}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Query paramter check 2", async (t) => {
  const request = new Request("http://localhost:3030/query-check/?aa=12&bb&c=33", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"aa":"12","bb":"","c":"33"}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: Query paramter check 3", async (t) => {
  const request = new Request("http://localhost:3030/query-check/?12=aa", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "application/json");
  assert.equal(h2, USER_AGENT);

  const s = '{"12":"aa"}';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: RegEx path match", async (t) => {
  const request = new Request("http://localhost:3030/regex/123/dept12345", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx path matched.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: RegEx path match", async (t) => {
  const request = new Request("http://localhost:3030/regex/123/dept1", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx path matched.';
  const data = await response.text();
  assert.equal(data, s);
  assert.equal(response.status, 200);
});

test("GET: RegEx path match fail", async (t) => {
  const request = new Request("http://localhost:3030/regex/123/dept", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.equal(response.status, 404);
  assert.equal(response.statusText, "Not Found");
  const s = 'Route not found';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: RegEx path match for toronto", async (t) => {
  const request = new Request("http://localhost:3030/regex/toronto", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx for path toronto matched.';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: RegEx path match for toronto", async (t) => {
  const request = new Request("http://localhost:3030/regex/tooronto", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx for path toronto matched.';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: RegEx path match for toronto", async (t) => {
  const request = new Request("http://localhost:3030/regex/tronto", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx for path toronto matched.';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: RegEx path match for toronto", async (t) => {
  const request = new Request("http://localhost:3030/regex/5tronto", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx for path toronto matched.';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: RegEx path match for toronto", async (t) => {
  const request = new Request("http://localhost:3030/regex/5toooooronto", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'RegEx for path toronto matched.';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 1", async (t) => {
  const request = new Request("http://localhost:3030/foo/bar", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo Bar';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 2", async (t) => {
  const request = new Request("http://localhost:3030/foo/boo", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const s = 'Foo boo';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 3", async (t) => {
  const request = new Request("http://localhost:3030/foo/boo/bar1", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo boo bar1';
  const data = await response.text();
  assert.equal(data, s);
});
test("GET: Test Static route match before Named routes 4", async (t) => {
  const request = new Request("http://localhost:3030/foo/boo/bar2", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo boo bar2';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 5", async (t) => {
  const request = new Request("http://localhost:3030/foo/boo/bar2/bar", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo boo bar2 bar';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 6", async (t) => {
  const request = new Request("http://localhost:3030/foo/boo/bar2/car", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo boo bar2 car';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: Test Static route match before Named routes 7", async (t) => {
  const request = new Request("http://localhost:3030/foo/moo/bar2/bar", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/plain");
  assert.equal(h2, USER_AGENT);

  const s = 'Foo moo bar2 bar';
  const data = await response.text();
  assert.equal(data, s);
});

test("HEAD: Unsupported method", async (t) => {
  const request = new Request("http://localhost:3030/mox", {
    method: "HEAD",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  assert.equal(response.status, 404);
});

test("ALL: Testing All with GET", async (t) => {
  const request = new Request("http://localhost:3030/all", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);

  const h1 = response.headers.get("Content-Type");
  const h2 = response.headers.get("User-Agent");
  assert.ok(h1 !== null);
  assert.ok(h2 !== null);
  assert.equal(h1, "text/html");
  assert.equal(h2, USER_AGENT);

  const s = '<h1>All Page</h1>\n<p>A paragraph all about nothing.\n';
  const data = await response.text();
  assert.equal(data, s);
});

test("GET: /headers", async (t) => {
  const request = new Request("http://localhost:3030/headers", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const s = '{"msg": "Headers set"}';

  const data = await response.text();
  const c1 = response.headers.get("set-cookie");

  assert.equal(data, s);
  assert.equal(c1, "session_id=1234567890; page_id=service;");
});

test("OPTIONS: Cors default headers", async (t) => {
  const request = new Request("http://localhost:3030/", {
    method: "OPTIONS",
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const c1 = response.headers.get("Access-Control-Allow-Origin");
  const c2 = response.headers.get("Access-Control-Allow-Methods");
  const c3 = response.headers.get("Access-Control-Allow-Headers");
  const c4 = response.headers.get("Access-Control-Allow-Credentials");
  const c5 = response.headers.get("Access-Control-Max-Age");
  await response.body?.cancel(); // cancel the body to avoid memory leak
  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test("GET: Check route Cors default headers", async (t) => {
  const request = new Request("http://localhost:3030/", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const c1 = response.headers.get("Access-Control-Allow-Origin");
  const c2 = response.headers.get("Access-Control-Allow-Methods");
  const c3 = response.headers.get("Access-Control-Allow-Headers");
  const c4 = response.headers.get("Access-Control-Allow-Credentials");
  const c5 = response.headers.get("Access-Control-Max-Age");
  await response.text();
  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test("HEAD: Basic test /head", async (t) => {
  const request = new Request("http://localhost:3030/head", {
    method: "HEAD",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  await response.body?.cancel(); // cancel the body to avoid memory leak
  assert.ok(response.ok);
  const c1 = response.headers.get("content-length");
  const c2 = response.headers.get("content-type");
  assert.equal(c1, null);
  assert.equal(c2, "text/html");
  assert.equal(response.status, 200);

});

test("HEAD: Basic test /head/one with ETag", async (t) => {
  const request = new Request("http://localhost:3030/head/one", {
    method: "HEAD",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  await response.body?.cancel(); // cancel the body to avoid memory leak
  assert.ok(response.ok);
  const c1 = response.headers.get("content-length");
  const c2 = response.headers.get("content-type");
  const c3 = response.headers.get("ETag");
  assert.equal(c1, null);
  assert.equal(c2, "text/html");
  assert.equal(c3, "1234567890");
  assert.equal(response.status, 200);

});

test("OPTIONS: Basic test / with ETag", async (t) => {
  const request = new Request("http://localhost:3030/", {
    method: "OPTIONS",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  await response.body?.cancel(); // cancel the body to avoid memory leak
  assert.ok(response.ok);
  // TODO: should Furi be returning a zero for this?
  // const c1 = response.headers.get("content-length");
  const c2 = response.headers.get("content-type");
  const c3 = response.headers.get("ETag");
  // TODO: should Furi be returning a zero for this?
  // assert.equal(c1, "0");
  assert.equal(c2, "text/html");
  assert.equal(c3, "dflkgnektlj");
  assert.equal(response.status, 200);
});

test("OPTIONS: Basic test / with ETag", async (t) => {
  const request = new Request("http://localhost:3030/options", {
    method: "OPTIONS",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  await response.body?.cancel(); // cancel the body to avoid memory leak
  assert.ok(response.ok);
  // TODO: should Furi be returning a zero for this?
  // const c1 = response.headers.get("content-length");
  const c2 = response.headers.get("content-type");
  const c3 = response.headers.get("ETag");
  // TODO: should Furi be returning a zero for this?
  // assert.equal(c1, "0");
  assert.equal(c2, "text/html");
  assert.equal(c3, "3409583068");
  assert.equal(response.status, 200);
});

test("OPTIONS: Check route / Cors default headers", async (t) => {
  const request = new Request("http://localhost:3030/", {
    method: "OPTIONS",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const c1 = response.headers.get("Access-Control-Allow-Origin");
  const c2 = response.headers.get("Access-Control-Allow-Methods");
  const c3 = response.headers.get("Access-Control-Allow-Headers");
  const c4 = response.headers.get("Access-Control-Allow-Credentials");
  const c5 = response.headers.get("Access-Control-Max-Age");
  await response.text();
  assert.equal(c1, "*");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});

test("OPTIONS: Check route /about Cors default headers override origin", async (t) => {
  const request = new Request("http://localhost:3030/about", {
    method: "OPTIONS",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  assert.ok(response.ok);
  const c1 = response.headers.get("Access-Control-Allow-Origin");
  const c2 = response.headers.get("Access-Control-Allow-Methods");
  const c3 = response.headers.get("Access-Control-Allow-Headers");
  const c4 = response.headers.get("Access-Control-Allow-Credentials");
  const c5 = response.headers.get("Access-Control-Max-Age");
  await response.text();
  assert.equal(c1, "http://localhost:3333");
  assert.equal(c2, "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  assert.equal(c3, "Content-Type, Authorization");
  assert.equal(c4, "false");
  assert.equal(c5, "86400");
});
