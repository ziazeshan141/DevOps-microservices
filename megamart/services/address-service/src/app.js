const express = require('express');

const routes = require('./routes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const { ready } = require('./config/database');

const {
  metricsMiddleware,
  metricsHandler,
} = require('./metrics');

const app = express();

app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  req.serviceName = 'address-service';

  res.setHeader('x-service-name', 'address-service');

  next();
});


// ============================================================
// PROMETHEUS METRICS
// ============================================================

app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);


// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'address-service',
  })
);


// ============================================================
// READINESS CHECK
// ============================================================

app.get('/ready', async (req, res) => {
  try {
    await ready();

    res.json({
      status: 'ready',
      service: 'address-service',
    });
  } catch (e) {
    res.status(503).json({
      status: 'not-ready',
      message: e.message,
    });
  }
});


// ============================================================
// APPLICATION ROUTES
// ============================================================

app.use(routes);


// ============================================================
// ERROR HANDLING
// ============================================================

app.use(notFound);

app.use(errorHandler);

module.exports = app;