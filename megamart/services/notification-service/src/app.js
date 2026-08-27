const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  req.serviceName = 'notification-service';
  res.setHeader('x-service-name', 'notification-service');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.get('/ready', (req, res) => res.json({ status: 'ready', service: 'notification-service' }));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
