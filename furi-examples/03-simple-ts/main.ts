import { Furi, ApplicationContext  } from '@furi-server/furi';

const app = new Furi();
app.get('/', (ctx: ApplicationContext) => {
  return { message: 'Hello From Furi' };
});
app.start();
