import { handler } from './build/handler.js';
import polka from 'polka';

const app = polka();
app.use(handler);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
