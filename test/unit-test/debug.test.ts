import test from 'node:test';
import assert from 'node:assert/strict'

import {
  ApplicationContext,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
} from '../../lib/furi';


class TestFuriRouter extends FuriRouter {
  getRouteMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

test('FuriRouter: add router with middleware to another router', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router1.use('/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);


  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

test('FuriRouter: add router with middleware to another router', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router1.use('/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/api/:version', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

test('FuriRouter: add router with middleware to another router', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router1.use('/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router2.use('/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/api/:version', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

test('FuriRouter: add router with middleware to another router', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Route 1A');
  });
  router1.use('/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Route 1B');
  });

  router2.use('/route/:two/named/:route', (ctx: ApplicationContext) => {
    ctx.end('Route 2A');
  });
  router2.use('/route/:two/about/:time', (ctx: ApplicationContext) => {
    ctx.end('Route 2B');
  });

  router2.use('/api/:version', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 4);
  }
});
