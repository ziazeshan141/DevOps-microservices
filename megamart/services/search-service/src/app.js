const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  req.serviceName = 'search-service';
  res.setHeader('x-service-name', 'search-service');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'search-service' }));
app.get('/ready', (req, res) => res.json({ status: 'ready', service: 'search-service' }));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
