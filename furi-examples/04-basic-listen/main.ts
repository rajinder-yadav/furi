import { Furi, ApplicationContext  } from '@furi-server/furi';

const app = new Furi();

app.get('/', (ctx: ApplicationContext) => {
  return { message: 'Hello From Furi' };
});

app.listen({
  server: {
    port: 3333,
    host: 'localhost',
    env: 'development',
    callback: () => console.log('Server is running on http://localhost:3333')
  }
});
