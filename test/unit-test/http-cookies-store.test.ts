import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
  assertFalse,
} from '@std/assert';

import { HttpCookiesStore } from '../../lib/utils/http-cookies-store.ts';
import { TimePeriod } from '../../lib/utils/time-period.ts';
import { StoreState } from "../../lib/state.ts";
import { ApplicationContext, Furi, HttpRequest, HttpResponse } from "../../lib/furi.ts";
import { Socket } from "node:net";


Deno.test('TimePeriod: expires 1 min', () => {
  assertEquals(TimePeriod.expires({ minutes: 1 }), 1 * 60 * 1000);
});
Deno.test('TimePeriod: expires 5 min', () => {
  assertEquals(TimePeriod.expires({ minutes: 5 }), 5 * 60 * 1000);
});
Deno.test('TimePeriod: expires 3 hours', () => {
  assertEquals(TimePeriod.expires({ hours: 3 }), 3 * 60 * 60 * 1000);
});
Deno.test('TimePeriod: expires multiple options', () => {
  assertEquals(TimePeriod.expires({
    minutes: 8,
    hours: 3,
    days: 2,
    weeks: 1,
    months: 4
  }),
    8 * 60 * 1000 +
    3 * 60 * 60 * 1000 +
    2 * 24 * 60 * 60 * 1000 +
    1 * 7 * 24 * 60 * 60 * 1000 +
    4 * 30 * 24 * 60 * 60 * 1000);
});

Deno.test('HttpCookiesStore: new store', () => {
  const store = new HttpCookiesStore();
  assertEquals(store.cookies, {});
});

Deno.test('HttpCookiesStore::isSiteValue', () => {
  const store = new HttpCookiesStore();
  assertExists(store.isSiteValue('Lax'));
  assertExists(store.isSiteValue('Strict'));
  assertExists(store.isSiteValue('None'));
});

Deno.test('HttpCookiesStore::signCookie+verify', () => {
  const store = new HttpCookiesStore();
  const signature = store.signCookie('name=yadav', 'super-duper-secret');
  assertEquals(store.verifyCookie('name=yadav', signature, 'super-duper-secret'), true);
  assertFalse(store.verifyCookie('name=yadav', signature, 'super-secret'));
});

Deno.test('HttpCookiesStore::sign+verify', () => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.cookie('userId', 'devguy');
  store.cookie('role', 'developer');
  store.sign('name', 'super-duper-secret');
  assertEquals(store.cookie('name'), 'yadav');
  assertEquals(store.verify('name', 'super-duper-secret'), true);
  assertEquals(store.verify('name', 'super-secret'), false);
});

Deno.test('HttpCookiesStore: new cookie', () => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  assertEquals(store.cookie('name'), 'yadav');
});

Deno.test('HttpCookiesStore: clear', () => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  assertEquals(store.cookie('name'), 'yadav');
  store.clear();
  assertEquals(store.cookies, {});
});

Deno.test('HttpCookiesStore: delete', () => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.delete('name');
  assertEquals(store.generateCookieHeaders(), ['name=yadav; Max-Age=0']);
});

Deno.test('HttpCookiesStore: expires - number', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', 1234);

  assertEquals(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(1234).toUTCString())}`]);
});

Deno.test('HttpCookiesStore: expires - string', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', new Date(1234).toUTCString());

  assertEquals(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(1234).toUTCString())}`]);
});

Deno.test('HttpCookiesStore: expires - object', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', { days: 1 });

  assertEquals(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString())}`]);
});

Deno.test('HttpCookiesStore: maxAGE', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .maxAge('user', 3600);

  assertEquals(store.maxAge('user'), 3600);
  assertArrayIncludes(store.generateCookieHeaders(), ['user=123; Max-Age=3600']);
});

Deno.test('HttpCookiesStore: domain', () => {
  const store = new HttpCookiesStore();
  store.cookie('role', 'dev')
  store.domain('role', 'example.com');

  assertEquals(store.domain('role'), 'example.com');
  assertEquals(store.generateCookieHeaders(), ['role=dev; Domain=example.com']);
});

Deno.test('HttpCookiesStore: firstPartyDomain', () => {
  const store = new HttpCookiesStore();
  store.cookie('role', 'dev')
  store.firstPartyDomain('role', 'example2.com');

  assertEquals(store.firstPartyDomain('role'), 'example2.com');
  assertEquals(store.generateCookieHeaders(), ['role=dev; firstPartyDomain=example2.com']);
});

Deno.test('HttpCookiesStore: httpOnly true', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'test123');
  store.httpOnly('user', true);

  assertEquals(store.httpOnly('user'), true);
  assertEquals(store.generateCookieHeaders(), ['user=test123; HttpOnly']);
});

Deno.test('HttpCookiesStore: httpOnly false', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'test123');
  store.httpOnly('user', false);

  assertEquals(store.httpOnly('user'), undefined);
  assertEquals(store.generateCookieHeaders(), ['user=test123']);
});

Deno.test('HttpCookiesStore: httpOnly + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin', { Secure: true, HttpOnly: true });

  assertEquals(store.secure('user'), true);
  assertEquals(store.httpOnly('user'), true);
  assertEquals(store.generateCookieHeaders(), [`user=admin; Secure; HttpOnly`]);
});

Deno.test('HttpCookiesStore: path + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').path('user', '/api');

  assertEquals(store.path('user'), '/api');
  assertEquals(store.generateCookieHeaders(), [`user=admin; Path=${encodeURIComponent('/api')}`]);
});

Deno.test('HttpCookiesStore: secure true + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure('user', true);

  assertEquals(store.secure('user'), true);
  assertEquals(store.generateCookieHeaders(), [`user=admin; Secure`]);
});

Deno.test('HttpCookiesStore: secure false + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure(false);

  assertEquals(store.cookie('user'), 'admin');
  assertEquals(store.secure('user'), undefined);
  assertEquals(store.generateCookieHeaders(), [`user=admin`]);
});

Deno.test('HttpCookiesStore: parse active', () => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; active=true; Secure; HttpOnly');

  assertEquals(store.cookie('active'), 'true');

  assertEquals(store.secure('active'), 'true');
  assertEquals(store.httpOnly('active'), 'true');
  assertEquals(store.expires('active'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});

Deno.test('HttpCookiesStore: parse user', () => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; user=123; Secure; HttpOnly');

  assertEquals(store.cookie('user'), '123');

  assertEquals(store.secure('user'), 'true');
  assertEquals(store.httpOnly('user'), 'true');
  assertEquals(store.expires('user'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});
Deno.test('HttpCookiesStore: parse name', () => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; name=yadav; Secure; HttpOnly');

  assertEquals(store.cookie('name'), 'yadav');

  assertEquals(store.secure('name'), 'true');
  assertEquals(store.httpOnly('name'), 'true');
  assertEquals(store.expires('name'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});

Deno.test('HttpCookiesStore::setCookies', () => {
  const httpRequest = new HttpRequest(new Socket());
  const httpResponse = new HttpResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.setCookies(ctx);
  const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
  assertEquals(setCookies.includes('name=yadav'), true);
});

Deno.test('HttpCookiesStore::setCookies', () => {
  const request = new HttpRequest(new Socket());
  const response = new HttpResponse(request);
  const ctx = new ApplicationContext(new StoreState(), request, response);
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.cookie('role', 'admin');
  store.setCookies(ctx);
  const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
  assertEquals(setCookies.includes('name=yadav'), true);
  assertEquals(setCookies.includes('role=admin'), true);
});

Deno.test('HttpCookiesStore: parse', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .expires('user', { minutes: 15 })
    .cookie('name', 'yadav')
    .cookie('active', true)
    .secure('name', true)
    .httpOnly('active', true);

  assertEquals(store.cookie('user'), 123);
  assertEquals(store.cookie('name'), 'yadav');
  assertEquals(store.cookie('active'), true);

  assertEquals(store.secure('name'), true);
  assertEquals(store.httpOnly('active'), true);
  assertEquals(store.expires('user'), `${new Date(Date.now() + 15 * 60 * 1000).toUTCString()}`);
  const cookies = store.generateCookieHeaders();

  assertArrayIncludes(cookies, ['active=true; HttpOnly']);
});

Deno.test('HttpCookiesStore: signed', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sign('user', 'xyz123');

  assertEquals(store.verify('user', 'xyz123'), true);
});

Deno.test('HttpCookiesStore: signed no signature', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123);

  assertEquals(store.verify('user', 'xyz123'), false);
});

Deno.test('HttpCookiesStore: parse signed cookie', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sign('user', 'xyz123');

  const signedCookie = store.generateCookieString('user');
  store.clear();
  assertEquals(store.cookies, {});

  assertExists(signedCookie);
  store.parseCookies(signedCookie);
  assertEquals(store.verify('user', 'xyz123'), true);
});

Deno.test('HttpCookiesStore: sameSite valid Strict', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Strict');

  assertArrayIncludes(store.generateCookieHeaders(), ['user=123; SameSite=Strict']);
});

Deno.test('HttpCookiesStore: sameSite valid Lax', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Lax');

  assertArrayIncludes(store.generateCookieHeaders(), ['user=123; SameSite=Lax']);
});

Deno.test('HttpCookiesStore: sameSite valid None', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'None');

  assertArrayIncludes(store.generateCookieHeaders(), ['user=123; SameSite=None']);
});

Deno.test('HttpCookiesStore: sameSite valid Stric', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Super');

  assertArrayIncludes(store.generateCookieHeaders(), ['user=123']);
});



// Cookies

Deno.test('HttpCookiesStore: cookie single', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 1289);

  assertEquals(store.cookie('user'), 1289);
  assertArrayIncludes(store.generateCookieHeaders(), ['user=1289']);
});

Deno.test('HttpCookiesStore: cookie multiple', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 1289)
    .cookie('role', 'devops');

  assertEquals(store.cookie('user'), 1289);
  assertEquals(store.cookie('role'), 'devops');
  assertArrayIncludes(store.generateCookieHeaders(), ['user=1289', 'role=devops']);
});

Deno.test('HttpCookiesStore: cookie with all options', () => {
  const date = new Date(Date.now() + 3600 * 1000);
  const store = new HttpCookiesStore();
  store
    .cookie('user', 1289)
    .cookie('role', 'devops',
      {
        Domain: 'www.example.com',
        Path: '/',
        HttpOnly: true,
        Secure: true,
        SameSite: 'Strict',
        'Max-Age': 3600,
        Expires: date
      });

  assertEquals(store.cookie('user'), 1289);
  assertEquals(store.cookie('role'), 'devops');

  const headers = store.generateCookieHeaders();
  assertArrayIncludes(headers, ['user=1289']);
  assertExists(headers.includes('HttpOnly'));
  assertExists(headers.includes('Secure'));
  assertExists(headers.includes('SameSite=Strict'));
  assertExists(headers.includes('Max-Age=3600'));
  assertExists(headers.includes(encodeURIComponent('Path=/')));
  assertExists(headers.includes(encodeURIComponent('Expires=`${date.toUTCString()}`')));
  assertExists(headers.includes(encodeURIComponent('Domain=www.example.com')));
});
