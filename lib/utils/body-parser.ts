import { ApplicationContext } from '../application-context.ts';
import { Middleware } from "../types.ts";
import { Furi, LOG_ERROR } from "../furi.ts";

export function JSONBodyParserMiddleware(ctx: ApplicationContext, next: Middleware): any {
  const body: Uint8Array[] = [];

  ctx.request
    .on("data", (chunk: Uint8Array) => {
      body.push(chunk);
    })
    .on("end", () => {
      try {
        const resultBody = JSON.parse(body.concat().toString());
        Furi.appStore.storeState('body', resultBody);
        ctx.request.body = resultBody; // Assign parsed body to request object for easy access
        next();
      } catch (error) {
        LOG_ERROR(`jsonBodyParser: parsing JSON body: ${error}`);
        ctx.response.writeHead(400, { 'Content-Type': 'application/json' });
        ctx.end({ error: 'Invalid JSON' });
      }
    });
}
