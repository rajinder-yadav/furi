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
 * Named route - Single Router Test Cases unmounted.
 */

Deno.test('FuriRouter: add middleware to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);

  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);

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
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);

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
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.namedRoutePartitionMap[2]);
    assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);

  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:name', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);
    } else {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test:/named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);
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
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(routeMap.staticRouteMap['/']);
  assertEquals(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(routeMap.namedRoutePartitionMap[2].length, 2);
    }
  }
});

/*********************************************************************
 * Named Route - Two routers with one router mounter on
 * another as a top-level middleware.
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
  router2.use('/route2/:named',router1);

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

  router2.use('/route2/:named',router1);

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

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 1);
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
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:named', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  router2.use('/route2/:named', router1);

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

  router2.use('/route2/:named', router1);

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

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap2.staticRouteMap['/route2/:named']);
    assertFalse(httpMap2.staticRouteMap['/route2/:named/test']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/route2/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertFalse(httpMap2.staticRouteMap['/route2/test/:route1']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
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

  // Make sure top-level middleware map is empty.
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/test/:route1']);
  assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/route2/test']);
    assertEquals(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap2.staticRouteMap['/route2/:named']);
    assertFalse(httpMap2.staticRouteMap['/route2/:named/test']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertFalse(httpMap2.staticRouteMap['/route2/test/:route1']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/:named']);
    assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 2);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

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
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
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

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap2.staticRouteMap['/route2/:named']);
    assertFalse(httpMap2.staticRouteMap['/route2/:named/test']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/test']);
    assertFalse(httpMap2.staticRouteMap['/route2/test/:route1']);
    assertExists(httpMap2.namedRoutePartitionMap[3]);
    assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    assertExists(httpMap1.namedRoutePartitionMap[2]);
    assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap2.staticRouteMap['/route2/:named']);
    assertFalse(httpMap2.staticRouteMap['/route2/:named/test/:route1']);
    assertExists(httpMap2.namedRoutePartitionMap[4]);
    assertEquals(httpMap2.namedRoutePartitionMap[4].length, 1);
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 2);
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

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 1);
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
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 3);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 1);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 2);
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

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add 2 middlewares to a route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[4].length, 2);
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
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });
  router1.get('/test/:route1', (ctx: ApplicationContext) => {
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
    assertFalse(httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assertEquals(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 4);
    } else {
      assertEquals(httpMap2.namedRoutePartitionMap[3].length, 2);
    }
  }});


//======================================================================
// Misc
//======================================================================

Deno.test('FuriRouter: add router with middleware to another router', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);
});

Deno.test('FuriRouter: add router with 2  middlewares to another router', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 2);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 2);
});

Deno.test('FuriRouter: add router with 2 routes to another router', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/one']);
    assertEquals(routeMap.staticRouteMap['/one'].callbacks.length, 1);
    assertExists(routeMap.staticRouteMap['/two']);
    assertEquals(routeMap.staticRouteMap['/two'].callbacks.length, 1);
  }

});

Deno.test('FuriRouter: add router with duplicate routes to another router', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware A');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware B');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware C');
  });

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
  assertEquals(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/one']);
    assertEquals(routeMap.staticRouteMap['/one'].callbacks.length, 2);
    assertExists(routeMap.staticRouteMap['/two']);
    assertEquals(routeMap.staticRouteMap['/two'].callbacks.length, 3);
  }
});

Deno.test('FuriRouter: add router with duplicate routes to another router on a path', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware A');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware B');
  });
  router1.use('/two', (ctx: ApplicationContext) => {
    ctx.end('Middleware C');
  });

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
  assertEquals(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

  router2.use('/three', router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    // Source router is unmodifiled.
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/one']);
    assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
    assertExists(httpMap1.staticRouteMap['/two']);
    assertEquals(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

    // Destination router has copy of source route.
    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/three/one']);
    assertEquals(httpMap2.staticRouteMap['/three/one'].callbacks.length, 2);
    assertExists(httpMap2.staticRouteMap['/three/two']);
    assertEquals(httpMap2.staticRouteMap['/three/two'].callbacks.length, 3);
  }
});

Deno.test('FuriRouter: add router with middleware on same route to another router', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.get('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 3');
  });

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  // Only the get should have 3 callbacks.
  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/one'].callbacks.length, 3);
    } else {
      assertEquals(routeMap.staticRouteMap['/one'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add router with middleware on same route to another router on a path', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.get('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 3');
  });

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 3);

  router2.use('/three', router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/three']);

  // Only the get should have 3 callbacks.
  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/three/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assertEquals(routeMap.staticRouteMap['/three/one'].callbacks.length, 3);
    } else {
      assertEquals(routeMap.staticRouteMap['/three/one'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add router with middleware to another router on a path', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/test', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/'].callbacks.length, 1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap2.staticRouteMap['/']);
  assertEquals(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertFalse(routeMap.staticRouteMap['/test']);
  }
});

Deno.test('FuriRouter: add router with middleware on a route to another router on ', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/text']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
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

Deno.test('FuriRouter: router will route middleware added as middleware to route', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/two', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertFalse(httpMap1.staticRouteMap['/one']);
  assertFalse(httpMap1.staticRouteMap['/two']);
  assertFalse(httpMap1.staticRouteMap['/two/one']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);
  assertFalse(httpMap2.staticRouteMap['/one']);
  assertFalse(httpMap2.staticRouteMap['/two']);
  assertFalse(httpMap2.staticRouteMap['/two/one']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    // source map is not modified.
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/one']);
    assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 1);


    // destination map had a copy of source map.
    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/two/one']);
    assertEquals(httpMap2.staticRouteMap['/two/one'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add handler to GET path', () => {
  const router = new TestFuriRouter();

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.POST];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to GET path', () => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.get('/one', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router2.use('/two', router1);

  let routeMap: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/one']);
  assertFalse(routeMap.staticRouteMap['/two']);
  assertFalse(routeMap.staticRouteMap['/two/one']);

  routeMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/one']);
  assertFalse(routeMap.staticRouteMap['/two']);
  assertFalse(routeMap.staticRouteMap['/two/one']);

  routeMap = router1.getRouteMap()[HttpMapIndex.GET];
  assertExists(routeMap.staticRouteMap['/one']);
  assertEquals(routeMap.staticRouteMap['/one'].callbacks.length, 1);

  routeMap = router2.getRouteMap()[HttpMapIndex.GET];
  assertFalse(routeMap.staticRouteMap['/one']);
  assertFalse(routeMap.staticRouteMap['/two']);
  assertExists(routeMap.staticRouteMap['/two/one']);
  assertEquals(routeMap.staticRouteMap['/two/one'].callbacks.length, 1);

  routeMap = router1.getRouteMap()[HttpMapIndex.POST];
  assertFalse(routeMap.staticRouteMap['/one']);
  assertFalse(routeMap.staticRouteMap['/two']);
  assertFalse(routeMap.staticRouteMap['/two/one']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router2.getRouteMap()[HttpMapIndex.POST];
  assertFalse(routeMap.staticRouteMap['/one']);
  assertFalse(routeMap.staticRouteMap['/two']);
  assertFalse(routeMap.staticRouteMap['/two/one']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to POST path', () => {
  const router = new TestFuriRouter();

  router.post('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.POST];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to PUT path', () => {
  const router = new TestFuriRouter();

  router.put('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.PUT];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to PATCH path', () => {
  const router = new TestFuriRouter();

  router.patch('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.PATCH];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to DELETE path', () => {
  const router = new TestFuriRouter();

  router.delete('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.DELETE];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);
});

Deno.test('FuriRouter: add handler to ALL path', () => {
  const router = new TestFuriRouter();

  router.all('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(routeMap.staticRouteMap['/test']);
  assertFalse(routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(routeMap.staticRouteMap['/test']);
    assertEquals(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }

});

Deno.test('FuriRouter: add 2 handlers', () => {
  const router = new TestFuriRouter();

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(routeMap.staticRouteMap['/test']);
  assertExists(routeMap.staticRouteMap['/test/more']);

});

Deno.test('FuriRouter: add 3 handlers, 2 to named routes', () => {
  const router = new TestFuriRouter();

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/:more', (ctx: ApplicationContext) => { // [2]
    ctx.end('Hello World');
  });
  router.get('/test/:more/more', (ctx: ApplicationContext) => { // [3]
    ctx.end('Hello World');
  });

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(routeMap.staticRouteMap['/test']);
  assertEquals(routeMap.namedRoutePartitionMap[2].length, 1);
  assertEquals(routeMap.namedRoutePartitionMap[3].length, 1);
});
