require('dotenv').config();
const app = require('./app');


const port = Number(process.env.PORT || 3019);

async function start() {

  app.listen(port, () => console.log('checkout-service listening on http://localhost:' + port));
}

start().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
