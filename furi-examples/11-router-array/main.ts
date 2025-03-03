import {
  Furi,
  ApplicationContext,
  Routes,
  Middleware
} from '@furi-server/furi';

function middlewareHandler (ctx: ApplicationContext, next: Middleware) {
  ctx.send('Middleware Pre!\n');
  next();
}

function oneHandler(ctx: ApplicationContext) {
  ctx.end('One!\n');
}

const routes: Routes = {
  // Multiple routes on the same path and method
  // work like middleware.
  routes: [
    {
      method: 'get',
      path: '/one',
      // Declare multiple handler using a "controller" array.
      controller: middlewareHandler
    },
    {
      method: 'get',
      path: '/one',
      // Declare multiple handler using a "controller" array.
      controller: oneHandler
    },
    // We can combine multiple handlers into an array.
    {
      method: 'get',
      path: '/two',
      // Declare multiple handler using a "controller" array.
      controller: [middlewareHandler, oneHandler]
    },
  ]
};

const app = Furi.create();
app.use(routes);
app.start();
