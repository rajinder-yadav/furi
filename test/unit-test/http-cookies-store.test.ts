import test from 'node:test';
import assert from 'node:assert/strict'

import { HttpCookiesStore } from '../../lib/utils/http-cookies-store';
import { TimePeriod } from '../../lib/utils/time-period';
import { GlobalStore } from '../../lib/global-store';
import { ApplicationContext, Furi, FuriRequest, FuriResponse } from '../../lib/furi';
import { Socket } from 'node:net';


test('TimePeriod: expires 1 min', (t) => {
  assert.equal(TimePeriod.expires({ minutes: 1 }), 1 * 60 * 1000);
});
test('TimePeriod: expires 5 min', (t) => {
  assert.equal(TimePeriod.expires({ minutes: 5 }), 5 * 60 * 1000);
});
test('TimePeriod: expires 3 hours', (t) => {
  assert.equal(TimePeriod.expires({ hours: 3 }), 3 * 60 * 60 * 1000);
});
test('TimePeriod: expires multiple options', (t) => {
  assert.equal(TimePeriod.expires({
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

test('HttpCookiesStore: new store', (t) => {
  const store = new HttpCookiesStore();
  assert.deepEqual(store.cookies, {});
});

test('HttpCookiesStore::isSiteValue', (t) => {
  const store = new HttpCookiesStore();
  assert.ok(store.isSiteValue('Lax'));
  assert.ok(store.isSiteValue('Strict'));
  assert.ok(store.isSiteValue('None'));
});

test('HttpCookiesStore::signCookie+verify', (t) => {
  const store = new HttpCookiesStore();
  const signature = store.signCookie('name=yadav', 'super-duper-secret');
  assert.equal(store.verifyCookie('name=yadav', signature, 'super-duper-secret'), true);
  assert.ok(!store.verifyCookie('name=yadav', signature, 'super-secret'));
});

test('HttpCookiesStore::sign+verify', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.cookie('userId', 'devguy');
  store.cookie('role', 'developer');
  store.sign('name', 'super-duper-secret');
  assert.equal(store.cookie('name'), 'yadav');
  assert.equal(store.verify('name', 'super-duper-secret'), true);
  assert.equal(store.verify('name', 'super-secret'), false);
});

test('HttpCookiesStore: new cookie', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  assert.equal(store.cookie('name'), 'yadav');
});

test('HttpCookiesStore: clear', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  assert.equal(store.cookie('name'), 'yadav');
  store.clear();
  assert.deepEqual(store.cookies, {});
});

test('HttpCookiesStore: delete', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.delete('name');
  assert.deepEqual(store.generateCookieHeaders(), ['name=yadav; Max-Age=0']);
});

test('HttpCookiesStore: expires - number', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', 1234);

  assert.deepEqual(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(1234).toUTCString())}`]);
});

test('HttpCookiesStore: expires - string', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', new Date(1234).toUTCString());

  assert.deepEqual(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(1234).toUTCString())}`]);
});

test('HttpCookiesStore: expires - object', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('name', 'yadav')
    .expires('name', { days: 1 });

  assert.deepEqual(store.generateCookieHeaders(), [`name=yadav; Expires=${encodeURIComponent(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString())}`]);
});

test('HttpCookiesStore: maxAGE', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .maxAge('user', 3600);

  assert.equal(store.maxAge('user'), 3600);
  assert.deepEqual(store.generateCookieHeaders(), ['user=123; Max-Age=3600']);
});

test('HttpCookiesStore: domain', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('role', 'dev')
  store.domain('role', 'example.com');

  assert.equal(store.domain('role'), 'example.com');
  assert.deepEqual(store.generateCookieHeaders(), ['role=dev; Domain=example.com']);
});

test('HttpCookiesStore: firstPartyDomain', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('role', 'dev')
  store.firstPartyDomain('role', 'example2.com');

  assert.equal(store.firstPartyDomain('role'), 'example2.com');
  assert.deepEqual(store.generateCookieHeaders(), ['role=dev; firstPartyDomain=example2.com']);
});

test('HttpCookiesStore: httpOnly true', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'test123');
  store.httpOnly('user', true);

  assert.equal(store.httpOnly('user'), true);
  assert.deepEqual(store.generateCookieHeaders(), ['user=test123; HttpOnly']);
});

test('HttpCookiesStore: httpOnly false', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'test123');
  store.httpOnly('user', false);

  assert.equal(store.httpOnly('user'), undefined);
  assert.deepEqual(store.generateCookieHeaders(), ['user=test123']);
});

test('HttpCookiesStore: httpOnly + generateCookieHeader', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin', { Secure: true, HttpOnly: true });

  assert.equal(store.secure('user'), true);
  assert.equal(store.httpOnly('user'), true);
  assert.deepEqual(store.generateCookieHeaders(), [`user=admin; Secure; HttpOnly`]);
});

test('HttpCookiesStore: path + generateCookieHeader', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').path('user', '/api');

  assert.equal(store.path('user'), '/api');
  assert.deepEqual(store.generateCookieHeaders(), [`user=admin; Path=${encodeURIComponent('/api')}`]);
});

test('HttpCookiesStore: secure true + generateCookieHeader', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure('user', true);

  assert.equal(store.secure('user'), true);
  assert.deepEqual(store.generateCookieHeaders(), [`user=admin; Secure`]);
});

test('HttpCookiesStore: secure false + generateCookieHeader', (t) => {
  const store = new HttpCookiesStore();
  store.cookie('user', 'admin').secure(false);

  assert.equal(store.cookie('user'), 'admin');
  assert.equal(store.secure('user'), undefined);
  assert.deepEqual(store.generateCookieHeaders(), [`user=admin`]);
});

test('HttpCookiesStore: parse active', (t) => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; active=true; Secure; HttpOnly');

  assert.equal(store.cookie('active'), 'true');

  assert.equal(store.secure('active'), 'true');
  assert.equal(store.httpOnly('active'), 'true');
  assert.equal(store.expires('active'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});

test('HttpCookiesStore: parse user', (t) => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; user=123; Secure; HttpOnly');

  assert.equal(store.cookie('user'), '123');

  assert.equal(store.secure('user'), 'true');
  assert.equal(store.httpOnly('user'), 'true');
  assert.equal(store.expires('user'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});
test('HttpCookiesStore: parse name', (t) => {
  const store = new HttpCookiesStore();
  store.parseCookies('Expires=Thu%2C%2006%20Mar%202025%2003%3A52%3A29%20GMT; name=yadav; Secure; HttpOnly');

  assert.equal(store.cookie('name'), 'yadav');

  assert.equal(store.secure('name'), 'true');
  assert.equal(store.httpOnly('name'), 'true');
  assert.equal(store.expires('name'), 'Thu, 06 Mar 2025 03:52:29 GMT');
});

test('HttpCookiesStore::setCookies', (t) => {
  const httpRequest = new FuriRequest(new Socket());
  const httpResponse = new FuriResponse(httpRequest);
  const ctx = new ApplicationContext(Furi.appStore, httpRequest, httpResponse);

  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.setCookies(ctx);
  const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
  assert.equal(setCookies.includes('name=yadav'), true);
});

test('HttpCookiesStore::setCookies', (t) => {
  const request = new FuriRequest(new Socket());
  const response = new FuriResponse(request);
  const ctx = new ApplicationContext(new GlobalStore(), request, response);
  const store = new HttpCookiesStore();
  store.cookie('name', 'yadav');
  store.cookie('role', 'admin');
  store.setCookies(ctx);
  const setCookies: string[] = ctx.response.getHeader('Set-Cookie') as string[];
  assert.equal(setCookies.includes('name=yadav'), true);
  assert.equal(setCookies.includes('role=admin'), true);
});

test('HttpCookiesStore: parse', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .expires('user', { minutes: 15 })
    .cookie('name', 'yadav')
    .cookie('active', true)
    .secure('name', true)
    .httpOnly('active', true);

  assert.equal(store.cookie('user'), 123);
  assert.equal(store.cookie('name'), 'yadav');
  assert.equal(store.cookie('active'), true);

  assert.equal(store.secure('name'), true);
  assert.equal(store.httpOnly('active'), true);
  const strExpires = `${new Date(Date.now() + 15 * 60 * 1000).toUTCString()}`;
  assert.equal(store.expires('user'), `${strExpires}`);

  const cookies = store.generateCookieHeaders();
  assert.deepEqual(cookies, [`user=123; Expires=${encodeURIComponent(strExpires)}`, 'name=yadav; Secure', 'active=true; HttpOnly']);
});

test('HttpCookiesStore: signed', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sign('user', 'xyz123');

  assert.equal(store.verify('user', 'xyz123'), true);
});

test('HttpCookiesStore: signed no signature', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123);

  assert.equal(store.verify('user', 'xyz123'), false);
});

test('HttpCookiesStore: parse signed cookie', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sign('user', 'xyz123');

  const signedCookie = store.generateCookieString('user');
  store.clear();
  assert.deepEqual(store.cookies, {});

  assert.ok(signedCookie);
  store.parseCookies(signedCookie);
  assert.equal(store.verify('user', 'xyz123'), true);
});

test('HttpCookiesStore: sameSite valid Strict', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Strict');

  assert.deepEqual(store.generateCookieHeaders(), ['user=123; SameSite=Strict']);
});

test('HttpCookiesStore: sameSite valid Lax', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Lax');

  assert.deepEqual(store.generateCookieHeaders(), ['user=123; SameSite=Lax']);
});

test('HttpCookiesStore: sameSite valid None', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'None');

  assert.deepEqual(store.generateCookieHeaders(), ['user=123; SameSite=None']);
});

test('HttpCookiesStore: sameSite valid Stric', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 123)
    .sameSite('user', 'Super');

  assert.deepEqual(store.generateCookieHeaders(), ['user=123']);
});

// Cookies

test('HttpCookiesStore: cookie single', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 1289);

  assert.equal(store.cookie('user'), 1289);
  assert.deepEqual(store.generateCookieHeaders(), ['user=1289']);
});

test('HttpCookiesStore: cookie multiple', (t) => {
  const store = new HttpCookiesStore();
  store
    .cookie('user', 1289)
    .cookie('role', 'devops');

  assert.equal(store.cookie('user'), 1289);
  assert.equal(store.cookie('role'), 'devops');
  assert.deepEqual(store.generateCookieHeaders(), ['user=1289', 'role=devops']);
});

test('HttpCookiesStore: cookie with all options', (t) => {
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
        Expires: date.toUTCString()
      });

  assert.equal(store.cookie('role'), 'devops');

  const headers = store.generateCookieHeaders();
  const values = headers[1].split(';').map(value => value.trim());
  console.log(values);

  console.log(`Expires=${encodeURIComponent(date.toUTCString())}`);


  assert.ok(headers.includes('user=1289'));
  assert.ok(values.includes('HttpOnly'));
  assert.ok(values.includes('Secure'));
  assert.ok(values.includes('SameSite=Strict'));
  assert.ok(values.includes('Max-Age=3600'));
  assert.ok(values.includes(`Path=${encodeURIComponent('/')}`));
  assert.ok(values.includes(`Expires=${encodeURIComponent(date.toUTCString())}`));
  assert.ok(values.includes('Domain=www.example.com'));
});
