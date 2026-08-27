function notFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} was not found` });
}

function errorHandler(err, req, res, next) {
  console.error(`[${req.serviceName || 'service'}]`, err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
    message: status === 500 ? 'Internal server error' : err.message,
  });
}

module.exports = { notFound, errorHandler };
