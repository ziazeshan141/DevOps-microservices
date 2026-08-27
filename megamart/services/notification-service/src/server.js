require('dotenv').config();
const app = require('./app');


const port = Number(process.env.PORT || 3010);

async function start() {

  app.listen(port, () => console.log('notification-service listening on http://localhost:' + port));
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
