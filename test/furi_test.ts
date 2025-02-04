/**
 * FURI - Fast Uniform Resource Identifier
 *
 * The Fast and Furious Node Router
 * Copyright(c) 2016 Rajinder Yadav
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is releases as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// 1) Compile in watch mode: tsc --watch test.ts
// 2) Run test with verbose errors: mocha --reporter spec


/* Sample response JSON
{
   "req":{
      "method":"GET",
      "url":"localhost:3100",
      "headers":{
         "user-agent":"node-superagent/3.4.1"
      }
   },
   "header":{
      "content-type":"text/html",
      "user-agent":"FURI Node Server (v0.1)",
      "date":"Mon, 06 Feb 2017 04:30:12 GMT",
      "connection":"close",
      "transfer-encoding":"chunked"
   },
   "status":200,
   "text":"<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n"
}
*/
import { assertEquals } from "@std/assert";

Deno.test("Root path without end slash", async () => {
  const request = new Request("http://localhost:3100", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Root path with end slash", async () => {
  const request = new Request("http://localhost:3100/", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }

});


Deno.test("About without end slash", async () => {
  const request = new Request("http://localhost:3100/about", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>About FURI</h1>\nThis is the about page.\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("About with end slash", async () => {
  const request = new Request("http://localhost:3100/about/", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>About FURI</h1>\nThis is the about page.\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("/about/raj12", async () => {
  const user_id = "raj12";
  const request = new Request(`http://localhost:3100/about/${user_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("/about/raj12/", async() => {
  const user_id = "raj12";
  const request = new Request(`http://localhost:3100/about/${user_id}/`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if(response.ok) {
    const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("/about/5612", async () => {
  const user_id = "5612";
  const request = new Request(`http://localhost:3100/about/${user_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("About with query string", async () => {
  const request = new Request("http://localhost:3100/about?s=45bnj34", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if(response.ok) {
    const s = "<h1>About FURI</h1>\nThis is the about page.\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("About with end slash and query string", async () => {
  const request = new Request("http://localhost:3100/about/?we=394845hjh", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if(response.ok) {
    const s = "<h1>About FURI</h1>\nThis is the about page.\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});


Deno.test("/about/raj12?er=345o85", async () => {
  const user_id = "raj12";
  const request = new Request(`http://localhost:3100/about/${user_id}?er=345o85`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("/about/raj12/?er=345o85", async () => {
  const user_id = "raj12";
  const request = new Request(`http://localhost:3100/about/${user_id}/?er=345o85`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>About User Page!</h1>\nUser page for: ${user_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Root path with query string", async () => {
  const request = new Request("http://localhost:3100?q=dfjriour", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Root path with end slash and query string", async () => {
  const request = new Request("http://localhost:3100/?q=dfjriour", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>FURI</h1>\n<p>Welcome to Node FURI, the fast and furiour Node Router!</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("User id and photo id route segments", async () => {
  const user_id = "5612";
  const photo_id = "drjr3494nd";
  const request = new Request(`http://localhost:3100/user/${user_id}/photo/${photo_id}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>User Photo Page!</h1>\nUser ${user_id} photo ${photo_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("User id and photo id route segments with trailing slash", async () => {
  const user_id = "5612";
  const photo_id = "drjr3494nd";
  const request = new Request(`http://localhost:3100/user/${user_id}/photo/${photo_id}/`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>User Photo Page!</h1>\nUser ${user_id} photo ${photo_id}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Toronto Regex segmented path 1", async () => {
  const code = "fd034j";
  const path = `/toronto/${code}/can`;
  const request = new Request(`http://localhost:3100${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
  if (response.ok) {
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Toronto Regex segmented path 2", async () => {
  const code = "fd034j";
  const path = `/toronto/${code}/ca233n`;
  const request = new Request(`http://localhost:3100${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Toronto Regex segmented path 3", async () => {
  const code = "fd034j";
  const path = `/torrronto/${code}/can`;
  const request = new Request(`http://localhost:3100${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Toronto Regex segmented path 4", async () => {
  const code = "fd034j";
  const path = `/torrronto/${code}/ca1233n`;
  const request = new Request(`http://localhost:3100${path}`, {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = `<h1>Toronto Canada</h1>\nCode is ${code}\n`;
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Chaining handlers", async () => {
  const request = new Request("http://localhost:3100/chain", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n<p>This paragraph is form handler 2</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Chaining handlers halting", async () => {
  const request = new Request("http://localhost:3100/chainhalt", {
    method: "GET",
    headers: {
      "content-type": "text/html",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "<h1>Chained Handlers</h1>\n<p>This paragraph is form handler 1</p>\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment", {
    method: "PATCH",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "PATCH a fresh comment.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment/how-to", {
    method: "PATCH",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "PATCH How to post a comment page.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route without empty body", async () => {
  const request = new Request("http://localhost:3100/comment/how", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = '{"message":"PATCH comment with id","id":"how","text":""}';
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route without text body", async () => {
  const request = new Request("http://localhost:3100/comment/how", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text: "This is a test comment." }),
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = '{"message":"PATCH comment with id","id":"how","text":"{\\"text\\":\\"This is a test comment.\\"}"}';
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route without text body", async () => {
  const request = new Request("http://localhost:3100/comment", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
    body: JSON.stringify({ text: "This is a test comment." }),
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = 'POST a fresh comment.';
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route", async () => {
  const request = new Request("http://localhost:3100/comment/how-to", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "POST How to post a comment page.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment how to route without empty body", async () => {
  const request = new Request("http://localhost:3100/comment/how", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = '{"message":"POST comment with id","id":"how","text":""}';
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "PUT a fresh comment.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment/how-to", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "PUT How to post a comment page.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment/how", {
    method: "PUT",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "PUT comment with id: how";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "DELETE a comment.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment/how-to", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "DELETE How to post a comment page.";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Comment route without end slash", async () => {
  const request = new Request("http://localhost:3100/comment/how", {
    method: "DELETE",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "DELETE comment with id: how";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});

Deno.test("Middleware end processing early", async () => {
  const request = new Request("http://localhost:3100/middleware", {
    method: "GET",
    headers: {
      "content-type": "text/plain",
    },
  });
  const response: Response = await fetch(request);
  if (response.ok) {
    const s = "About page Middleware 1\nAbout page Middleware 2\n";
    const data = await response.text();
    assertEquals(data, s);
    assertEquals(response.status, 200);
  }
});
