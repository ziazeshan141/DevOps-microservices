const client = require('prom-client');
const packageJson = require('../package.json');

const serviceName = packageJson.name.replace(/^@[^/]+\//, '');

const register = new client.Registry();

register.setDefaultLabels({
  service: serviceName,
});

client.collectDefaultMetrics({
  register,
});

const httpRequestsTotal = new client.Counter({
  name: 'megamart_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['service', 'method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'megamart_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['service', 'method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register],
});

function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationSeconds =
      Number(process.hrtime.bigint() - start) / 1_000_000_000;

    const route =
      req.route?.path ||
      req.baseUrl ||
      req.path ||
      'unknown';

    const labels = {
      service: serviceName,
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);

    httpRequestDurationSeconds.observe(
      labels,
      durationSeconds
    );
  });

  next();
}

async function metricsHandler(req, res) {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
}

module.exports = {
  metricsMiddleware,
  metricsHandler,
};
