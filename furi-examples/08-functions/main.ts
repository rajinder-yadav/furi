import { Furi, ApplicationContext, Middleware, HandlerFunction } from '@furi-server/furi';

function helloWorld(ctx: ApplicationContext): any {
  return { message: 'Hello From Furi' };
}

function one(ctx: ApplicationContext, next: Middleware) {
  ctx.send("One\n");
  next();
}
function two(ctx: ApplicationContext, next: Middleware) {
  // call the next Middlewaree function
  next();
  // Send response after all Middlewaree functions have been called.
  // We end the respones here.
  ctx.end("Two\n");
}

function three(ctx: ApplicationContext, next: Middleware) {
  ctx.send("Three\n");
  next();
}

const app = new Furi();

// Pass handler function directly to the route.
app.get('/', helloWorld);

// Pass handler functions directly to the route.
app.get('/calls', one, two, three);

// Handler functions array.
const steps: HandlerFunction[] = [one, two, three];

// Pass handler functions array to the route using the spread operator.
app.get('/steps', ...steps);

app.start();
