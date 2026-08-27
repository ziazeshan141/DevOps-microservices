require('dotenv').config();
const app = require('./app');
const { initSchema } = require('./config/schema');

const port = Number(process.env.PORT || 3024);

async function start() {
  await initSchema();
  app.listen(port, () => console.log('fraud-service listening on http://localhost:' + port));
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
