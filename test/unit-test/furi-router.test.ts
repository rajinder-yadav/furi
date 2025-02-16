import { Socket } from 'node:net';
import { assertEquals, assertNotEquals, assertFalse, assertExists } from '@std/assert';

import {
  ApplicationContext,
  Furi,
  FuriRouter,
  UriMap,
  HttpMapIndex,
} from '../../lib/furi.ts';


class TestFuriRouter extends FuriRouter {

  getUriMap(): UriMap[] {
    return this.httpMaps;
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

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.static_uri_map['/']);
  assertEquals(httpMap.static_uri_map['/'].callbacks.length, 1);
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

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.static_uri_map['/']);
  assertEquals(httpMap.static_uri_map['/'].callbacks.length, 2);
});

Deno.test('FuriRouter: add middleware to a route', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: UriMap = router.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/test']);
    assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);
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

  const httpMap: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.static_uri_map['/']);
  assertEquals(httpMap.static_uri_map['/'].callbacks.length, 1);
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

  const httpMap: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertExists(httpMap.static_uri_map['/']);
  assertEquals(httpMap.static_uri_map['/'].callbacks.length, 2);
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

  const httpMap: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap.static_uri_map['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: UriMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/one']);
    assertEquals(httpMap.static_uri_map['/one'].callbacks.length, 1);
    assertExists(httpMap.static_uri_map['/two']);
    assertEquals(httpMap.static_uri_map['/two'].callbacks.length, 1);
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

  const httpMap1: UriMap = router1.getUriMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.static_uri_map['/']);
  assertEquals(httpMap1.static_uri_map['/one'].callbacks.length, 3);
  assertEquals(httpMap1.static_uri_map['/two'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.static_uri_map['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: UriMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/one']);
    assertEquals(httpMap.static_uri_map['/one'].callbacks.length, 3);
    assertExists(httpMap.static_uri_map['/two']);
    assertEquals(httpMap.static_uri_map['/two'].callbacks.length, 3);
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

  const httpMap1: UriMap = router1.getUriMap()[HttpMapIndex.GET];
  assertFalse(httpMap1.static_uri_map['/']);
  assertEquals(httpMap1.static_uri_map['/one'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: UriMap = router2.getUriMap()[HttpMapIndex.MIDDLEWARE];
  assertFalse(httpMap2.static_uri_map['/']);

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: UriMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/one']);
    assertEquals(httpMap1.static_uri_map['/one'].callbacks.length, 3);
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
    const httpMap: UriMap = router2.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/two/one']);
  }
});

Deno.test('ApplicationContext: add handler to GET path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.GET];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);

});

Deno.test('ApplicationContext: add handler to POST path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.post('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.POST];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);

});

Deno.test('ApplicationContext: add handler to PUT path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.put('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.PUT];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);

});

Deno.test('ApplicationContext: add handler to PATCH path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.patch('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.PATCH];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);

});

Deno.test('ApplicationContext: add handler to DELETE path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.delete('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.DELETE];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);

});

Deno.test('ApplicationContext: add handler to ALL path', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.all('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const count = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < count; ++mapIndex) {
    const httpMap: UriMap = router.getUriMap()[mapIndex];
    assertExists(httpMap.static_uri_map['/test']);
    assertEquals(httpMap.static_uri_map['/test'].callbacks.length, 1);
  }

});

Deno.test('ApplicationContext: add 2 handlers', async () => {
  const furi = new Furi();
  const router = new TestFuriRouter(furi);

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.GET];
  assertExists(httpMap.static_uri_map['/test']);
  assertExists(httpMap.static_uri_map['/test/more']);

});

Deno.test('ApplicationContext: add 3 handlers, 2 to named routes', async () => {
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

  const httpMap: UriMap = router.getUriMap()[HttpMapIndex.GET];
  assertExists(httpMap.static_uri_map['/test']);
  assertEquals(httpMap.named_uri_map[2].length, 1);
  assertEquals(httpMap.named_uri_map[3].length, 1);
});
