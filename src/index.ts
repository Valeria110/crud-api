import 'dotenv/config';
import { isMulti } from './utils';
import cluster from 'node:cluster';
import { startServer } from './server/server';
import { createWorkers } from './server/cluster';

const PORT = process.env.PORT ?? 4000;
const isMultiMode = isMulti();

if (!PORT) {
  console.error('PORT is not defined');
  process.exit(1);
}

if (isMultiMode && cluster.isPrimary) {
  createWorkers(+PORT);
} else if (isMultiMode && cluster.isWorker) {
  startServer(+PORT);
} else {
  startServer(+PORT);
}
