async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs || process.env.HTTP_TIMEOUT_MS || 5000);
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) };
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const error = new Error(body?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

function authHeaders(req) {
  return req.headers.authorization ? { authorization: req.headers.authorization } : {};
}

function internalHeaders() {
  return { 'x-service-token': process.env.INTERNAL_SERVICE_TOKEN || 'megamart-local-service-token-change-me' };
}

module.exports = { requestJson, authHeaders, internalHeaders };
