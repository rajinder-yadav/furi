import {
  Furi,
  ApplicationContext,
  Routes,
  BaseRouterHandler,
  Middleware
} from '@furi-server/furi';

/**
 * Class based handler for a route.
 */
class HelloFuri extends BaseRouterHandler {
  handle(ctx: ApplicationContext): any {
    return { message: 'Hello From Furi' };
  }
}

const USER_AGENT: string = 'FURI Node Server (v0.1)';

const routes: Routes = {
  // Declare top-level middleware here.
  middleware: [
    (ctx: ApplicationContext, next: Middleware) => {

      ctx.send('Top-level Middleware!\n');
      next();
    }
  ],
  // Declare routes here.
  routes: [
    {
      method: 'get',
      path: '/one',
      // Declare multiple handler using a "controller" array.
      controller: [
        (ctx: ApplicationContext, next: Middleware) => {
          ctx.send('Middleware Pre!\n');
          next();
        },
        (ctx: ApplicationContext) => {
          ctx.end('One!\n');
        }
      ]
    },
    {
      method: 'get',
      path: '/hello',
      // Use a class based handler for the route.
      controller: HelloFuri
    }
  ]
};

const app = Furi.create();
app.use(routes);
app.start();
