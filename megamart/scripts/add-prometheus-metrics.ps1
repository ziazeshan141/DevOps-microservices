$ErrorActionPreference = "Stop"

$services = @(
    "auth-service",
    "user-service",
    "product-service",
    "catalog-service",
    "inventory-service",
    "cart-service",
    "order-service",
    "payment-service",
    "shipping-service",
    "notification-service",
    "review-service",
    "rating-service",
    "search-service",
    "recommendation-service",
    "pricing-service",
    "promotion-service",
    "wishlist-service",
    "checkout-service",
    "api-gateway",
    "admin-service",
    "media-service",
    "analytics-service",
    "fraud-service"
)

$metricsContent = @'
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
'@

foreach ($service in $services) {

    Write-Host ""
    Write-Host "========================================="
    Write-Host "Processing: $service"
    Write-Host "========================================="

    $servicePath = Join-Path $PWD "services\$service"

    if (!(Test-Path $servicePath)) {
        Write-Warning "$service does not exist. Skipping."
        continue
    }

    # ---------------------------------------------------------
    # Install prom-client
    # ---------------------------------------------------------

    Push-Location $servicePath

    Write-Host "Installing prom-client..."

    npm install prom-client

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "npm install failed for $service"
        Pop-Location
        continue
    }

    Pop-Location


    # ---------------------------------------------------------
    # Create metrics.js
    # ---------------------------------------------------------

    $metricsFile = Join-Path $servicePath "src\metrics.js"

    Set-Content `
        -Path $metricsFile `
        -Value $metricsContent `
        -Encoding UTF8

    Write-Host "Created: src\metrics.js"


    # ---------------------------------------------------------
    # Find Express application file
    # ---------------------------------------------------------

    $appFile = Join-Path $servicePath "src\app.js"
    $serverFile = Join-Path $servicePath "src\server.js"

    if (Test-Path $appFile) {
        $targetFile = $appFile
    }
    elseif (Test-Path $serverFile) {
        $targetFile = $serverFile
    }
    else {
        Write-Warning "No app.js or server.js found for $service"
        continue
    }

    Write-Host "Patching: $targetFile"


    # ---------------------------------------------------------
    # Backup before modification
    # ---------------------------------------------------------

    $backupFile = "$targetFile.pre-prometheus.bak"

    if (!(Test-Path $backupFile)) {
        Copy-Item $targetFile $backupFile
        Write-Host "Backup created."
    }


    # ---------------------------------------------------------
    # Read source
    # ---------------------------------------------------------

    $content = Get-Content $targetFile -Raw


    # ---------------------------------------------------------
    # Add metrics require
    # ---------------------------------------------------------

    if ($content -notmatch "require\(['""]\.\/metrics['""]\)") {

        $expressPattern = "(const\s+express\s*=\s*require\(['""]express['""]\);?)"

        if ($content -match $expressPattern) {

            $metricsImport = @'

const {
  metricsMiddleware,
  metricsHandler,
} = require('./metrics');
'@

            $content = [regex]::Replace(
                $content,
                $expressPattern,
                "`$1$metricsImport",
                1
            )

            Write-Host "Added metrics import."
        }
        else {
            Write-Warning "Could not find Express import in $service."
            continue
        }
    }


    # ---------------------------------------------------------
    # Add middleware + /metrics route
    # ---------------------------------------------------------

    if ($content -notmatch "app\.use\(metricsMiddleware\)") {

        $appPattern = "(const\s+app\s*=\s*express\(\);?)"

        if ($content -match $appPattern) {

            $metricsSetup = @'


app.use(metricsMiddleware);

app.get('/metrics', metricsHandler);

'@

            $content = [regex]::Replace(
                $content,
                $appPattern,
                "`$1$metricsSetup",
                1
            )

            Write-Host "Added metrics middleware and endpoint."
        }
        else {
            Write-Warning "Could not find 'const app = express()' in $service."
            continue
        }
    }
    else {
        Write-Host "Metrics middleware already exists. Skipping patch."
    }


    # ---------------------------------------------------------
    # Save source
    # ---------------------------------------------------------

    Set-Content `
        -Path $targetFile `
        -Value $content `
        -Encoding UTF8


    # ---------------------------------------------------------
    # Syntax validation
    # ---------------------------------------------------------

    Write-Host "Checking JavaScript syntax..."

    node --check $metricsFile

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "metrics.js validation failed for $service"
        continue
    }

    node --check $targetFile

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "$targetFile validation failed."
        continue
    }

    Write-Host "$service completed successfully."
}

Write-Host ""
Write-Host "========================================="
Write-Host "Prometheus instrumentation completed"
Write-Host "========================================="