import test from 'node:test';
import assert from 'node:assert/strict'

import {
  ApplicationContext,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
  StaticRouteCallback
} from '../../lib/furi';


class TestFuriRouter extends FuriRouter {
  getRouteMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

/*********************************************************************
 * Test router initial settings.
 */
test('FuriRouter: HTTP Enum count', (t) => {
  assert.equal(Object.keys(HttpMapIndex).length, 8);
});

test('FuriRouter: map partition count', (t) => {
  const router = new TestFuriRouter();
  assert.equal(router.getRouteMap().length, 8);
});

test('FuriRouter: map routes are empty', (t) => {
  const router = new TestFuriRouter();

  // Make sure routes are empty
  const mapCount = router.getRouteMap().length;
  for (let i = 0; i < mapCount; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assert.ok(!map.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map.staticRouteMap).length, 0);
  }
});

/*********************************************************************
 * Single Router Test Cases unmounted.
 */

test('FuriRouter: OPTIONS /test', (t) => {
  const router = new TestFuriRouter();

  router.options('/test', (ctx: ApplicationContext) => {
    ctx.end('options');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.OPTIONS];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if(mapIndex === HttpMapIndex.OPTIONS) {
      assert.ok(routeMap.staticRouteMap['/test']);
      continue;
    }
    assert.ok(!routeMap.staticRouteMap['/test']);
  }
});

test('FuriRouter: OPTIONS /test/one', (t) => {
  const router = new TestFuriRouter();

  router.options('/test/options', (ctx: ApplicationContext) => {
    ctx.response.writeHead(200, {
      "Content-Type": "text/html",
      "ETag": "1234567890",
      "Access-Control-Allow-Origin": "http://localhost:3333"
    });
    ctx.end('options');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.OPTIONS];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if(mapIndex === HttpMapIndex.OPTIONS) {
      assert.ok(routeMap.staticRouteMap['/test/options']);
      continue;
    }
    assert.ok(!routeMap.staticRouteMap['/test/options']);
  }
});

test('FuriRouter: HEAD /test', (t) => {
  const router = new TestFuriRouter();

  router.head('/test', (ctx: ApplicationContext) => {
    ctx.end('HEAD');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.HEAD];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if(mapIndex === HttpMapIndex.HEAD) {
      assert.ok(routeMap.staticRouteMap['/test']);
      continue;
    }
    assert.ok(!routeMap.staticRouteMap['/test']);
  }
});

test('FuriRouter: HEAD /test/one', (t) => {
  const router = new TestFuriRouter();

  router.head('/test/HEAD', (ctx: ApplicationContext) => {
    ctx.response.writeHead(200, {
      "Content-Type": "text/html",
      "ETag": "1234567890",
      "Access-Control-Allow-Origin": "http://localhost:3333"
    });
    ctx.end('HEAD');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.HEAD];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if(mapIndex === HttpMapIndex.HEAD) {
      assert.ok(routeMap.staticRouteMap['/test/HEAD']);
      continue;
    }
    assert.ok(!routeMap.staticRouteMap['/test/HEAD']);
  }
});

test('FuriRouter: add routeless middleware', (t) => {
  const router = new TestFuriRouter();

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  // No top-level middleware.
  assert.ok(!routeMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  // Make sure routes are empty, skip top-level middleware.
  const mapCount = router.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {
    const routeMap: RouteMap = router.getRouteMap()[i];
    assert.equal(Object.keys(routeMap.staticRouteMap).length, 0);
    assert.ok(!routeMap.namedRoutePartitionMap.callbacks);
  }

  // Check top-level middleware count.
  // assert.ok(routeMap.staticRouteMap['/']);
  // assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 1);
  const staticRouteCallback1: StaticRouteCallback = routeMap.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 1);

});

test('FuriRouter: add two routless middleware', (t) => {
  const router = new TestFuriRouter();

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  // No top-level middleware.
  assert.ok(!routeMap.staticRouteMap['/']);

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  // Top-level middleware count.
  // assert.ok(routeMap.staticRouteMap['/']);
  // assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = routeMap.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {
    const map: RouteMap = router.getRouteMap()[i];
    assert.equal(Object.keys(map.staticRouteMap).length, 0);
    assert.ok(!map.namedRoutePartitionMap.callbacks);
  }

});

test('FuriRouter: add middleware to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.ok(routeMap.staticRouteMap['/test/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(routeMap.staticRouteMap['/test/one'].callbacks.length, 2);
      assert.equal(routeMap.staticRouteMap['/test/one/more'].callbacks.length, 1);
    } else {
      assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
      assert.equal(routeMap.staticRouteMap['/test/one'].callbacks.length, 1);
    }
  }
});

/*********************************************************************
 * Two routers with one router mounter on another as a
 * top-level middleware.
 */

test('FuriRouter: add routeless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use(router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 1);
  assert.equal(staticRouteCallback2.callbacks.length, 1);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add two routless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use(router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.equal(staticRouteCallback2.callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add middleware to a route', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounted on another router
 * on a given route.
 */

test('FuriRouter: add routeless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/route2', router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 1);
  assert.equal(staticRouteCallback2.callbacks.length, 1);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add two routless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });

  router2.use('/route2', router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.equal(staticRouteCallback2.callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add middleware to a route', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/test']);
  assert.ok(!httpMap2.staticRouteMap['/route2/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounter on another as a
 * top-level middleware. Both router having their own
 * middleware and routes.
 */

test('FuriRouter: add routeless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // No top-level middleware.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use(router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 1);
  assert.equal(staticRouteCallback2.callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add two routless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

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

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.equal(staticRouteCallback2.callbacks.length, 4);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add middleware to a route', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use(router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 6);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 6);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 8);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 8);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
    }
  }
});

/*********************************************************************
 * Two routers, with one router mounter on another to a
 * given route. Both router having their own middleware and routes.
 */

test('FuriRouter: add routeless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  // No top-level middleware.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router2.use('/route2', router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 1);
  assert.equal(staticRouteCallback2.callbacks.length, 2);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add two routless middleware', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

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

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.ok(staticRouteCallback2);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.equal(staticRouteCallback2.callbacks.length, 4);

  // Make sure routes are empty.
  const mapCount = router1.getRouteMap().length;
  for (let i = 1; i < mapCount; ++i) {

    const map1: RouteMap = router1.getRouteMap()[i];
    assert.ok(!map1.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map1.staticRouteMap).length, 0);

    const map2: RouteMap = router2.getRouteMap()[i];
    assert.ok(!map2.namedRoutePartitionMap.callbacks);
    assert.equal(Object.keys(map2.staticRouteMap).length, 0);
  }
});

test('FuriRouter: add middleware to a route', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/test']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 3);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 1);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/test']);
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 4);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap1.staticRouteMap['/']);
  assert.equal(routeMap1.staticRouteMap['/'].callbacks.length, 2);

  const routeMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(routeMap2.staticRouteMap['/']);
  assert.equal(routeMap2.staticRouteMap['/'].callbacks.length, 4);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(routeMap1.staticRouteMap['/test']);
    assert.ok(routeMap1.staticRouteMap['/test/one']);
    assert.ok(!routeMap1.staticRouteMap['/route2/test']);
    assert.ok(!routeMap1.staticRouteMap['/route2/test/one']);

    const routeMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(routeMap2.staticRouteMap['/test']);
    assert.ok(routeMap2.staticRouteMap['/test/one']);
    assert.ok(routeMap2.staticRouteMap['/route2/test']);
    assert.ok(routeMap2.staticRouteMap['/route2/test/one']);

    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap1.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(routeMap1.staticRouteMap['/test/one'].callbacks.length, 2);
      assert.equal(routeMap1.staticRouteMap['/test/one/more'].callbacks.length, 1);
      assert.ok(!routeMap1.staticRouteMap['/route2/test'])
      assert.ok(!routeMap1.staticRouteMap['/route2/test/one'])
      assert.ok(!routeMap1.staticRouteMap['/route2/test/one/more']);

      assert.equal(routeMap2.staticRouteMap['/test'].callbacks.length, 2);
      assert.equal(routeMap2.staticRouteMap['/test/one'].callbacks.length, 2);
      assert.equal(routeMap2.staticRouteMap['/test/one/more'].callbacks.length, 1);
      assert.equal(routeMap2.staticRouteMap['/route2/test'].callbacks.length, 2);
      assert.equal(routeMap2.staticRouteMap['/route2/test/one'].callbacks.length, 2);
      assert.equal(routeMap2.staticRouteMap['/route2/test/one/more'].callbacks.length, 1);
    } else {
      assert.equal(routeMap1.staticRouteMap['/test'].callbacks.length, 1);
      assert.equal(routeMap1.staticRouteMap['/test/one'].callbacks.length, 1);
      assert.ok(!routeMap1.staticRouteMap['/route2/test']);
      assert.ok(!routeMap1.staticRouteMap['/route2/test/one']);

      assert.equal(routeMap2.staticRouteMap['/test'].callbacks.length, 1);
      assert.equal(routeMap2.staticRouteMap['/test/one'].callbacks.length, 1);
      assert.equal(routeMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
      assert.equal(routeMap2.staticRouteMap['/route2/test/one'].callbacks.length, 1);
    }
  }
});
