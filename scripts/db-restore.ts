/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

const cp = require('child_process');

// Load environment variables (PGHOST, PGUSER, etc.)
require('../knexfile');

// Ensure that the SSL key file has correct permissions
if (process.env.PGSSLKEY) {
  cp.spawnSync('chmod', ['0600', process.env.PGSSLKEY], { stdio: 'inherit' });
}

cp.spawn(
  'psql',
  [
    '--file=backup.sql',
    '--echo-errors',
    '--no-readline',
    ...process.argv.slice(2).filter(x => !x.startsWith('--env')),
  ],
  {
    stdio: 'inherit',
  },
).on('exit', process.exit);
