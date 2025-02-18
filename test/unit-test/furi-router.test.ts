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

Deno.test('FuriRouter: HTTP Enum count', async () => {
  assertEquals(Object.keys(HttpMapIndex).length, 6);
});

Deno.test('FuriRouter: map partition count', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);
  assertEquals(router.getRouteMap().length, 6);
});

Deno.test('FuriRouter: map routes are empty', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  // Make sure routes are empty
  const count = router.getRouteMap().length;
  for (let i = 0; i < count; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assertFalse(map.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map.staticRouteMap).length, 0);
  }
});

Deno.test('FuriRouter: add routeless middleware', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  // Make sure routes are empty.
  const count = router.getRouteMap().length;
  for (let i = 1; i < count; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assertFalse(map.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map.staticRouteMap).length, 0);
  }

  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 1);
});

Deno.test('FuriRouter: add two routless middleware', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 2);

  // Make sure routes are empty.
  const count = router.getRouteMap().length;
  for (let i = 1; i < count; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assertFalse(map.namedRoutePartitionMap.callbacks);
    assertEquals(Object.keys(map.staticRouteMap).length, 0);
  }

});

Deno.test('FuriRouter: add middleware to a route', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  // Make sure top-level middleware map is empty.
  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/test']);
    assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add router with middleware to another router', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

Deno.test('FuriRouter: add router with 2  middlewares to another router', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

Deno.test('FuriRouter: add router with 2 routes to another router', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 1);
    assertExists(httpMap.staticRouteMap['/two']);
    assertEquals(httpMap.staticRouteMap['/two'].callbacks.length, 1);
  }

});

Deno.test('FuriRouter: add router with duplicate routes to another router', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 2);
    assertExists(httpMap.staticRouteMap['/two']);
    assertEquals(httpMap.staticRouteMap['/two'].callbacks.length, 3);
  }
});

Deno.test('FuriRouter: add router with middleware on same route to another router', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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
  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    if(mapIndex === HttpMapIndex.GET) {
      assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 3);
    } else {
      assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 2);
    }
  }
});

Deno.test('FuriRouter: add router with middleware to another router on a path', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap  = router2.getRouteMap()[mapIndex];
    assertFalse(httpMap.staticRouteMap['/test']);
  }
});

Deno.test('FuriRouter: add router with middleware on a route to another router on ', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

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

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap1: RouteMap  = router1.getRouteMap()[mapIndex];
    assertExists(httpMap1.staticRouteMap['/test']);
    assertEquals(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap  = router2.getRouteMap()[mapIndex];
    assertExists(httpMap2.staticRouteMap['/test']);
    assertEquals(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: router will route middleware added as middleware to route', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/two', router1);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/two/one']);
  }
});

Deno.test('FuriRouter: add handler to GET path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to POST path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.post('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.POST];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to PUT path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.put('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.PUT];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to PATCH path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.patch('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.PATCH];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to DELETE path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.delete('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.DELETE];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to ALL path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.all('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router.getRouteMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/test']);
    assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);
  }

});

Deno.test('FuriRouter: add 2 handlers', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(httpMap.staticRouteMap['/test']);
  assertExists(httpMap.staticRouteMap['/test/more']);

});

Deno.test('FuriRouter: add 3 handlers, 2 to named routes', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/:more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/:more/more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.namedRoutePartitionMap[2].length, 1);
  assertEquals(httpMap.namedRoutePartitionMap[3].length, 1);
});
