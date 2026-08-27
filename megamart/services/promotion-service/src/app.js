const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { ready } = require('./config/database');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  req.serviceName = 'promotion-service';
  res.setHeader('x-service-name', 'promotion-service');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'promotion-service' }));
app.get('/ready', async (req, res) => { try { await ready(); res.json({ status: 'ready', service: 'promotion-service' }); } catch (e) { res.status(503).json({ status: 'not-ready', message: e.message }); } });
app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
