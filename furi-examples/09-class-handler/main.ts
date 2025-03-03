import { Furi, ApplicationContext, BaseRouterHandler, ClassHandler } from '@furi-server/furi';

/**
 * Class based handler for a route.
 */
class HelloFuri extends BaseRouterHandler {
  handle(ctx: ApplicationContext): any {
    return { message: 'Hello From Furi' };
  }
}
const app = Furi.create();

// Mount handler Class to route using function ClassHandler()
app.get('/hello', ClassHandler(HelloFuri));
app.start();
