import test from 'node:test';
import assert from 'node:assert/strict'

import {
  ApplicationContext,
  FuriRouter,
  RouteMap,
  HttpMapIndex,
  StaticRouteCallback,
} from '../../lib/furi';


class TestFuriRouter extends FuriRouter {
  getRouteMap(): RouteMap[] {
    return this.httpMethodMap;
  }
}

/*********************************************************************
 * Named route - Single Router Test Cases unmounted.
 */

test('FuriRouter: add middleware to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use((ctx: ApplicationContext) => {
    ctx.end('Middleware');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);

  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);

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
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map contains an entry.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);

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
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.namedRoutePartitionMap[2]);
    assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);

  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
  const router = new TestFuriRouter();

  router.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router.get('/test/:name', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  // Make sure top-level middleware map is empty.
  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);
    } else {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);
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
  assert.ok(routeMap.staticRouteMap['/']);
  assert.equal(routeMap.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(routeMap.namedRoutePartitionMap[2].length, 2);
    }
  }
});

/*********************************************************************
 * Named Route - Two routers with one router mounter on
 * another as a top-level middleware.
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
  router1.use('/route2/:named', router2);

  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.ok(staticRouteCallback2);
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

  router2.use('/route2/:named', router1);

  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.ok(staticRouteCallback2);
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

  // Make sure routes are empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 1);
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
  router1.use('/test/:named', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });
  router1.use('/test/:named', (ctx: ApplicationContext) => {
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
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[2]);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[2].length, 2);
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
  router2.use('/route2/:named', router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 1);
  assert.ok(staticRouteCallback2);
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

  router2.use('/route2/:named', router1);

  // assert.ok(httpMap1.staticRouteMap['/']);
  // assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  // assert.ok(httpMap2.staticRouteMap['/']);
  // assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
  const staticRouteCallback1: StaticRouteCallback = httpMap1.staticRouteMap['/'] as StaticRouteCallback;
  const staticRouteCallback2: StaticRouteCallback = httpMap2.staticRouteMap['/'] as StaticRouteCallback;
  assert.ok(staticRouteCallback1);
  assert.equal(staticRouteCallback1.callbacks.length, 2);
  assert.ok(staticRouteCallback2);
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

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap2.staticRouteMap['/route2/:named']);
    assert.ok(!httpMap2.staticRouteMap['/route2/:named/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2', router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/route2/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(!httpMap2.staticRouteMap['/route2/test/:route1']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  // Make sure top-level middleware map is empty.
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
  assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/test']);
    assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/route2/test']);
    assert.equal(httpMap2.staticRouteMap['/route2/test'].callbacks.length, 1);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap2.staticRouteMap['/route2/:named']);
    assert.ok(!httpMap2.staticRouteMap['/route2/:named/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(!httpMap2.staticRouteMap['/route2/test/:route1']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/:named']);
    assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 1);
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

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 2);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
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

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap2.staticRouteMap['/route2/:named']);
    assert.ok(!httpMap2.staticRouteMap['/route2/:named/test']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
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
    assert.ok(!httpMap1.staticRouteMap['/test']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/test']);
    assert.ok(!httpMap2.staticRouteMap['/route2/test/:route1']);
    assert.ok(httpMap2.namedRoutePartitionMap[3]);
    assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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
  router1.use('/test/:route1', (ctx: ApplicationContext) => {
    ctx.end('Route');
  });

  router2.use('/route2/:named', router1);

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
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    assert.ok(httpMap1.namedRoutePartitionMap[2]);
    assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap2.staticRouteMap['/route2/:named']);
    assert.ok(!httpMap2.staticRouteMap['/route2/:named/test/:route1']);
    assert.ok(httpMap2.namedRoutePartitionMap[4]);
    assert.equal(httpMap2.namedRoutePartitionMap[4].length, 1);
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 2);
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

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 1);
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
    ctx.end('Route');
  });
  router1.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Method');
  });

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 3);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 3);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 1);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 3);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 1);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 2);
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

  router2.use('/route2/:named', router1);

  // Make sure top-level middleware map is empty.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 4);
    } else {
      assert.equal(httpMap1.staticRouteMap['/test'].callbacks.length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3][0].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add 2 middlewares to a route', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[4].length, 2);
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);
  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {

    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 4);
    } else {
      assert.equal(httpMap1.namedRoutePartitionMap[2].length, 2);
    }

    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!httpMap1.staticRouteMap['/route2/test/:route1']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 4);
    } else {
      assert.equal(httpMap2.namedRoutePartitionMap[3].length, 2);
    }
  }
});


//======================================================================
// Misc
//======================================================================

test('FuriRouter: add router with middleware to another router', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);
});

test('FuriRouter: add router with 2  middlewares to another router', (t) => {
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
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 2);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 2);
});

test('FuriRouter: add router with 2 routes to another router', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/one']);
    assert.equal(routeMap.staticRouteMap['/one'].callbacks.length, 1);
    assert.ok(routeMap.staticRouteMap['/two']);
    assert.equal(routeMap.staticRouteMap['/two'].callbacks.length, 1);
  }

});

test('FuriRouter: add router with duplicate routes to another router', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
  assert.equal(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/one']);
    assert.equal(routeMap.staticRouteMap['/one'].callbacks.length, 2);
    assert.ok(routeMap.staticRouteMap['/two']);
    assert.equal(routeMap.staticRouteMap['/two'].callbacks.length, 3);
  }
});

test('FuriRouter: add router with duplicate routes to another router on a path', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
  assert.equal(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

  router2.use('/three', router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    // Source router is unmodifiled.
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/one']);
    assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 2);
    assert.ok(httpMap1.staticRouteMap['/two']);
    assert.equal(httpMap1.staticRouteMap['/two'].callbacks.length, 3);

    // Destination router has copy of source route.
    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/three/one']);
    assert.equal(httpMap2.staticRouteMap['/three/one'].callbacks.length, 2);
    assert.ok(httpMap2.staticRouteMap['/three/two']);
    assert.equal(httpMap2.staticRouteMap['/three/two'].callbacks.length, 3);
  }
});

test('FuriRouter: add router with middleware on same route to another router', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 3);

  router2.use(router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);

  // Only the get should have 3 callbacks.
  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/one'].callbacks.length, 3);
    } else {
      assert.equal(routeMap.staticRouteMap['/one'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add router with middleware on same route to another router on a path', (t) => {
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
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 3);

  router2.use('/three', router1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/three']);

  // Only the get should have 3 callbacks.
  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/three/one']);
    if (mapIndex === HttpMapIndex.GET) {
      assert.equal(routeMap.staticRouteMap['/three/one'].callbacks.length, 3);
    } else {
      assert.equal(routeMap.staticRouteMap['/three/one'].callbacks.length, 2);
    }
  }
});

test('FuriRouter: add router with middleware to another router on a path', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use((ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/test', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap1.staticRouteMap['/']);
  assert.equal(httpMap1.staticRouteMap['/'].callbacks.length, 1);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(httpMap2.staticRouteMap['/']);
  assert.equal(httpMap2.staticRouteMap['/'].callbacks.length, 1);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(!routeMap.staticRouteMap['/test']);
  }
});

test('FuriRouter: add router with middleware on a route to another router on ', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use(router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/text']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
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

test('FuriRouter: router will route middleware added as middleware to route', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.use('/one', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  router2.use('/two', router1);

  // Make sure route1 map in unaffected.
  const httpMap1: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap1.staticRouteMap['/']);
  assert.ok(!httpMap1.staticRouteMap['/one']);
  assert.ok(!httpMap1.staticRouteMap['/two']);
  assert.ok(!httpMap1.staticRouteMap['/two/one']);

  const httpMap2: RouteMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!httpMap2.staticRouteMap['/']);
  assert.ok(!httpMap2.staticRouteMap['/one']);
  assert.ok(!httpMap2.staticRouteMap['/two']);
  assert.ok(!httpMap2.staticRouteMap['/two/one']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    // source map is not modified.
    const httpMap1: RouteMap = router1.getRouteMap()[mapIndex];
    assert.ok(httpMap1.staticRouteMap['/one']);
    assert.equal(httpMap1.staticRouteMap['/one'].callbacks.length, 1);


    // destination map had a copy of source map.
    const httpMap2: RouteMap = router2.getRouteMap()[mapIndex];
    assert.ok(httpMap2.staticRouteMap['/two/one']);
    assert.equal(httpMap2.staticRouteMap['/two/one'].callbacks.length, 1);
  }
});

test('FuriRouter: add handler to GET path', (t) => {
  const router = new TestFuriRouter();

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.POST];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to GET path', (t) => {
  const router1 = new TestFuriRouter();
  const router2 = new TestFuriRouter();

  router1.get('/one', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router2.use('/two', router1);

  let routeMap: RouteMap = router1.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/one']);
  assert.ok(!routeMap.staticRouteMap['/two']);
  assert.ok(!routeMap.staticRouteMap['/two/one']);

  routeMap = router2.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/one']);
  assert.ok(!routeMap.staticRouteMap['/two']);
  assert.ok(!routeMap.staticRouteMap['/two/one']);

  routeMap = router1.getRouteMap()[HttpMapIndex.GET];
  assert.ok(routeMap.staticRouteMap['/one']);
  assert.equal(routeMap.staticRouteMap['/one'].callbacks.length, 1);

  routeMap = router2.getRouteMap()[HttpMapIndex.GET];
  assert.ok(!routeMap.staticRouteMap['/one']);
  assert.ok(!routeMap.staticRouteMap['/two']);
  assert.ok(routeMap.staticRouteMap['/two/one']);
  assert.equal(routeMap.staticRouteMap['/two/one'].callbacks.length, 1);

  routeMap = router1.getRouteMap()[HttpMapIndex.POST];
  assert.ok(!routeMap.staticRouteMap['/one']);
  assert.ok(!routeMap.staticRouteMap['/two']);
  assert.ok(!routeMap.staticRouteMap['/two/one']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router2.getRouteMap()[HttpMapIndex.POST];
  assert.ok(!routeMap.staticRouteMap['/one']);
  assert.ok(!routeMap.staticRouteMap['/two']);
  assert.ok(!routeMap.staticRouteMap['/two/one']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to POST path', (t) => {
  const router = new TestFuriRouter();

  router.post('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.POST];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to PUT path', (t) => {
  const router = new TestFuriRouter();

  router.put('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.PUT];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to PATCH path', (t) => {
  const router = new TestFuriRouter();

  router.patch('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.PATCH];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to DELETE path', (t) => {
  const router = new TestFuriRouter();

  router.delete('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  let routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  routeMap = router.getRouteMap()[HttpMapIndex.DELETE];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);

  routeMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);
});

test('FuriRouter: add handler to ALL path', (t) => {
  const router = new TestFuriRouter();

  router.all('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.MIDDLEWARE];
  assert.ok(!routeMap.staticRouteMap['/test']);
  assert.ok(!routeMap.staticRouteMap['/']);

  const mapCount = Object.keys(HttpMapIndex).length;
  for (let mapIndex = 1; mapIndex < mapCount; ++mapIndex) {
    const routeMap: RouteMap = router.getRouteMap()[mapIndex];
    assert.ok(routeMap.staticRouteMap['/test']);
    assert.equal(routeMap.staticRouteMap['/test'].callbacks.length, 1);
  }

});

test('FuriRouter: add 2 handlers', (t) => {
  const router = new TestFuriRouter();

  router.get('/test', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });
  router.get('/test/more', (ctx: ApplicationContext) => {
    ctx.end('Hello World');
  });

  const routeMap: RouteMap = router.getRouteMap()[HttpMapIndex.GET];
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.ok(routeMap.staticRouteMap['/test/more']);

});

test('FuriRouter: add 3 handlers, 2 to named routes', (t) => {
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
  assert.ok(routeMap.staticRouteMap['/test']);
  assert.equal(routeMap.namedRoutePartitionMap[2].length, 1);
  assert.equal(routeMap.namedRoutePartitionMap[3].length, 1);
});
