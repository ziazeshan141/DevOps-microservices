require('dotenv').config();
const app = require('./app');


const port = Number(process.env.PORT || 3020);

async function start() {

  app.listen(port, () => console.log('api-gateway listening on http://localhost:' + port));
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
