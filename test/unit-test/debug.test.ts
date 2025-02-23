import {
  assertEquals,
  assertNotEquals,
  assertFalse,
  assertExists
} from '@std/assert';

import {
  ApplicationContext,
  Furi,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
} from '../../lib/furi.ts';


class TestFuriRouter extends FuriRouter {
  getRouteMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

Deno.test('FuriRouter: add router with middleware to another router', async () => {
  const furi = new Furi();
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
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);


  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

Deno.test('FuriRouter: add router with middleware to another router', async () => {
  const furi = new Furi();
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
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    // assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

Deno.test('FuriRouter: add router with middleware to another router', async () => {
  const furi = new Furi();
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
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

Deno.test('FuriRouter: add router with middleware to another router', async () => {
  const furi = new Furi();
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
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 4);
  }
});
