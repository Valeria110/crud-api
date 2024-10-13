import 'dotenv/config';
import { isMulti } from './utils/utils';
import cluster from 'node:cluster';
import { startServer } from './server/server';
import { createWorkers } from './server/worker';

const PORT = process.env.PORT;
const isMultiMode = isMulti();

if (!PORT) {
  console.error('PORT is not defined');
  process.exit(1);
}

if (isMultiMode && cluster.isPrimary) {
  createWorkers(Number(PORT));
} else if (isMultiMode && cluster.isWorker) {
  startServer(PORT);
  console.log('Starting worker server');
} else {
  startServer(PORT);
}
