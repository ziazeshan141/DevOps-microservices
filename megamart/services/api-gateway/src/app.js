const express = require('express');
const {
  metricsMiddleware,
  metricsHandler,
} = require('./metrics');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();

app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  req.serviceName = 'api-gateway';
  res.setHeader('x-service-name', 'api-gateway');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));
app.get('/ready', (req, res) => res.json({ status: 'ready', service: 'api-gateway' }));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

