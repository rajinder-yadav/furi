import { Furi  } from '@furi-server/furi';

const app = new Furi();
app.get('/', ctx => {
  return { message: 'Hello from Furi' };
});
app.start();
