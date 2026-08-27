require('dotenv').config();
const app = require('./app');
const { initSchema } = require('./config/schema');

const port = Number(process.env.PORT || 3015);

async function start() {
  await initSchema();
  app.listen(port, () => console.log('pricing-service listening on http://localhost:' + port));
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
