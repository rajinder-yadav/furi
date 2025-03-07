import {
  assertArrayIncludes,
  assertEquals,
} from '@std/assert';

import { HttpCookiesStore } from '../../lib/utils/http-cookies-store.ts';
import { TimePeriod } from '../../lib/utils/time-period.ts';


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

Deno.test('HttpCookiesStore: httpOnly', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'test123');
  store.httpOnly('user', true);

  assertEquals(store.httpOnly('user'), true);
  assertEquals(store.generateCookieHeaders(), ['user=test123; HttpOnly']);
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
  store.cookie('user', 'admin').path('user','/api');

  assertEquals(store.path('user'), '/api');
  assertEquals(store.generateCookieHeaders(), [`user=admin; Path=${encodeURIComponent('/api')}`]);
});

Deno.test('HttpCookiesStore: secure + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure('user', true);

  assertEquals(store.secure('user'), true);
  assertEquals(store.generateCookieHeaders(), [`user=admin; Secure`]);
});

Deno.test('HttpCookiesStore: secure + generateCookieHeader', () => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure(true);

  assertEquals(store.cookie('user'), 'admin');
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

Deno.test('HttpCookiesStore: parse', () => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', '123')
    .expires('user', { minutes: 15 })
    .cookie('name', 'yadav')
    .cookie('active', true)
    .secure('name', true)
    .httpOnly('active', true);

  assertEquals(store.cookie('user'), '123');
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
  .cookie('user', '123')
  .sign('user', 'xyz123');

  assertEquals(store.verify('user', 'xyz123'), true);
});

Deno.test('HttpCookiesStore: signed no signature', () => {
  const store = new HttpCookiesStore();
  store
  .cookie('user', '123');

  assertEquals(store.verify('user', 'xyz123'), false);
});

Deno.test('HttpCookiesStore: parse signed cookie', () => {
  const store = new HttpCookiesStore();
  store
  .cookie('user', '123')
  .sign('user', 'xyz123');

  const signedCookie = store.generateCookieString('user');
  store.clear();
  assertEquals(store.cookies, {});

  store.parseCookies(signedCookie);
  assertEquals(store.verify('user', 'xyz123'), true);
});
