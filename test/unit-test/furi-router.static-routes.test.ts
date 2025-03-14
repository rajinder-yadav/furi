import {
  assertEquals,
  assertFalse,
  assertExists
} from '@std/assert';

import {
  ApplicationContext,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
} from '../../lib/furi.ts';


class TestFuriRouter extends FuriRouter {
  getRouteMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

/*********************************************************************
 * Test router initial settings.
 */
Deno.test('FuriRouter: HTTP Enum count', () => {
  assertEquals(Object.keys(HttpMapIndex).length, 8);
});

Deno.test('FuriRouter: map partition count', () => {
  const router = new TestFuriRouter();
  assertEquals(router.getRouteMap().length, 8);
});

Deno.test('FuriRouter: map routes are empty', () => {
  const router = new TestFuriRouter();

  // Make sure routes are empty
  const mapCount = router.getRouteMap().length;
  for (let i = 0; i < mapCount; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assertFalse(map.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map.staticRouteMap).length, 0);
  }
});

/*********************************************************************
 * Single Router Test Cases unmounted.
 */

Deno.test('FuriRouter: add routeless middleware', () => {
  const router = new TestFuriRouter();

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  // No top-level middleware.
  assertFalse(routeMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  // Make sure routes are empty, skip top-level middleware.
  const mapCount = router.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {
    const routeMap: RouteMap = router.getRouteMap()[i];
    assertEquals(Object.keys(routeMap.staticRouteMap).length, 0);
    assertFalse(routeMap.namedRoutePartitionMap.callbacks);
  }

  // Check top-level middleware count.
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 1);
});

Deno.test('FuriRouter: add two routless middleware', () => {
  const router = new TestFuriRouter();

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  // No top-level middleware.
  assertFalse(routeMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  // Top-level middleware count.
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assertEquals(Object.keys(map.staticRouteMap).length, 0);
    assertFalse(map.namedRoutePartitionMap.callbacks);
  }

});

Deno.test('FuriRouter: add middleware to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test/one/more', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertExists(routeMap.staticRouteMap['/test/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(routeMap.staticRouteMap['/test/one'].callbacks.length, 2);
      assertEquals(routeMap.staticRouteMap['/test/one/more'].callbacks.length, 1);
    } else {
      assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
      assertEquals(routeMap.staticRouteMap['/test/one'].callbacks.length, 1);
    }
  }
});

/*********************************************************************
 * Two routers with one router mounter on another as a
 * top-level middleware.
 */

Deno.test('FuriRouter: add routeless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use(router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add two routless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use(router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add middleware to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);


  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounted on another router
 * on a given route.
 */

Deno.test('FuriRouter: add routeless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/route2', router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add two routless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use('/route2', router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add middleware to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/test']);
  assertFalse(httpMap2.staticRouteMap['/route2/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);


  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounter on another as a
 * top-level middleware. Both router having their own
 * middleware and routes.
 */

Deno.test('FuriRouter: add routeless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // No top-level middleware.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use(router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add two routless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use(router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add middleware to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 6);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 6);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 8);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 8);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounter on another to a
 * given route. Both router having their own middleware and routes.
 */

Deno.test('FuriRouter: add routeless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // No top-level middleware.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/route2', router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add two routless middleware', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use('/route2', router1);

  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assertFalse(map1.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assertFalse(map2.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map2.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add middleware to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/one/more', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.use('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router2.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test/one', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router2.get('/test/one/more', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2', router1);

  const routeMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap1.staticRouteMap['/']);
  assertEquals(routeMap1.staticRouteMap['/'].callbacks.length, 2);

  const routeMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap2.staticRouteMap['/']);
  assertEquals(routeMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(routeMap1.staticRouteMap['/test']);
    assertExists(routeMap1.staticRouteMap['/test/one']);
    assertFalse(routeMap1.staticRouteMap['/route2/test']);
    assertFalse(routeMap1.staticRouteMap['/route2/test/one']);

    const routeMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(routeMap2.staticRouteMap['/test']);
    assertExists(routeMap2.staticRouteMap['/test/one']);
    assertExists(routeMap2.staticRouteMap['/route2/test']);
    assertExists(routeMap2.staticRouteMap['/route2/test/one']);

    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap1.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(routeMap1.staticRouteMap['/test/one'].callbacks.length, 2);
      assertEquals(routeMap1.staticRouteMap['/test/one/more'].callbacks.length, 1);
      assertFalse(routeMap1.staticRouteMap['/route2/test'])
      assertFalse(routeMap1.staticRouteMap['/route2/test/one'])
      assertFalse(routeMap1.staticRouteMap['/route2/test/one/more']);

      assertEquals(routeMap2.staticRouteMap['/test'].callbacks.length, 2);
      assertEquals(routeMap2.staticRouteMap['/test/one'].callbacks.length, 2);
      assertEquals(routeMap2.staticRouteMap['/test/one/more'].callbacks.length, 1);
      assertEquals(routeMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
      assertEquals(routeMap2.staticRouteMap['/route2/test/one'].callbacks.length, 2);
      assertEquals(routeMap2.staticRouteMap['/route2/test/one/more'].callbacks.length, 1);
    } else {
      assertEquals(routeMap1.staticRouteMap['/test'].callbacks.length, 1);
      assertEquals(routeMap1.staticRouteMap['/test/one'].callbacks.length, 1);
      assertFalse(routeMap1.staticRouteMap['/route2/test']);
      assertFalse(routeMap1.staticRouteMap['/route2/test/one']);

      assertEquals(routeMap2.staticRouteMap['/test'].callbacks.length, 1);
      assertEquals(routeMap2.staticRouteMap['/test/one'].callbacks.length, 1);
      assertEquals(routeMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
      assertEquals(routeMap2.staticRouteMap['/route2/test/one'].callbacks.length, 1);
    }
  }
});
