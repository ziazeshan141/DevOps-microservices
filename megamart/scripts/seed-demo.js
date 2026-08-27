const { spawnSync } = require('node:child_process');

function run(args) {
  console.log(`> docker ${args.join(' ')}`);
  const result = spawnSync('docker', args, { stdio: 'inherit' });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('Seeding MegaMart demo catalog...');
run(['compose', 'cp', 'docker/postgres/seed-demo.sql', 'postgres:/tmp/seed-demo.sql']);
run(['compose', 'exec', '-T', 'postgres', 'sh', '-lc', 'psql -U "$POSTGRES_USER" -d postgres -f /tmp/seed-demo.sql']);
run(['compose', 'exec', '-T', 'redis', 'redis-cli', 'FLUSHDB']);
console.log('\nDone. Refresh http://localhost:8080');
console.log('Try searches: sports, electronics, fashion, devops');
console.log('Demo promotion code at checkout: WELCOME10');
