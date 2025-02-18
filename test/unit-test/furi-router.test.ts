import { Socket } from 'node:net';
import { assertEquals, assertNotEquals, assertFalse, assertExists } from '@std/assert';

import {
  ApplicationContext,
  Furi,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
} from '../../lib/furi.ts';


class TestFuriRouter extends FuriRouter {
  getUriMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

Deno.test('FuriRouter: map partition count', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);
  assertEquals(router.getUriMap().length, 6);
});

Deno.test('FuriRouter: add routeless middleware', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 1);
});

Deno.test('FuriRouter: add two routless middleware', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 2);
});

Deno.test('FuriRouter: add middleware to a route', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router.getUriMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/test']);
    assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

Deno.test('FuriRouter: add router with app level middleware', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  const httpMap: RouteMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 1);
});

Deno.test('FuriRouter: add router with app level middleware', async () => {
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

  const httpMap: RouteMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.staticRouteMap['/']);
  assertEquals(httpMap.staticRouteMap['/'].callbacks.length, 2);
});

Deno.test('FuriRouter: add router with app level middleware', async () => {
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

  const httpMap: RouteMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 1);
    assertExists(httpMap.staticRouteMap['/two']);
    assertEquals(httpMap.staticRouteMap['/two'].callbacks.length, 1);
  }

});

Deno.test('FuriRouter: add router with app level middleware', async () => {
  const furi = new Furi();
  const router1 = new TestFuriRouter(furi);
  const router2 = new TestFuriRouter(furi);

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 1');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 2');
  });
  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Middleware 3');
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

  const httpMap1: RouteMap = router1.getUriMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 3);
  assertEquals(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    assertEquals(httpMap.staticRouteMap['/one'].callbacks.length, 3);
    assertExists(httpMap.staticRouteMap['/two']);
    assertEquals(httpMap.staticRouteMap['/two'].callbacks.length, 3);
  }

});

Deno.test('FuriRouter: add router with app level middleware', async () => {
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

  const httpMap1: RouteMap = router1.getUriMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.staticRouteMap['/']);
  assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.staticRouteMap['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: RouteMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/one']);
    assertEquals(httpMap1.staticRouteMap['/one'].callbacks.length, 3);
  }

});

// Deno.test('FuriRouter: add router with route level middleware', async () => {
//   const furi = new Furi();
//   const router1 = new TestFuriRouter(furi);
//   const router2 = new TestFuriRouter(furi);

//   router1.use((ctx: ApplicationContext) => {
//     ctx.end('Hello World');
//   });

//   router2.use('/test', router1);

//   const httpMap: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
//   assertExists(httpMap.static_uri_map['/']);
//   assertEquals(httpMap.static_uri_map['/'].callbacks.length, 1);

//   // const count = Object.keys(HttpMapIndex).length;
//   // for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
//   //   const httpMap: UriMap = router2.getUriMap()[mapIndex];
//   //   assertFalse(httpMap.static_uri_map['/test']);
//   // }
// });

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
    const httpMap: RouteMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.staticRouteMap['/two/one']);
  }
});

Deno.test('FuriRouter: add handler to GET path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.GET];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to POST path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.post('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.POST];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to PUT path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.put('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.PUT];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to PATCH path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.patch('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.PATCH];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.staticRouteMap['/test'].callbacks.length, 1);

});

Deno.test('FuriRouter: add handler to DELETE path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.delete('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.DELETE];
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
    const httpMap: RouteMap = router.getUriMap()[mapIndex];
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

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.GET];
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

  const httpMap: RouteMap = router.getUriMap()[HttpMapIndex.GET];
  assertExists(httpMap.staticRouteMap['/test']);
  assertEquals(httpMap.namedRoutePartitionMap[2].length, 1);
  assertEquals(httpMap.namedRoutePartitionMap[3].length, 1);
});
