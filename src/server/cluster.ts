import cluster from 'node:cluster';
import { availableParallelism } from 'os';
import { IWorker } from '../types/types';
import { startServer } from './server';

const createWorkers = (PORT: number) => {
  const workersCount = availableParallelism() - 1;
  const workers: IWorker[] = [];

  for (let i = 0; i < workersCount; i++) {
    const workerPort = PORT + i + 1;
    const worker = cluster.fork({ PORT: workerPort });

    if (worker.process.pid) {
      workers.push({ pid: worker.process.pid, port: workerPort });
    } else {
      console.error(`Invalid pid for the dead worker: ${worker.process.pid}`);
    }
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker with pid ${worker.process.pid} died`);
    const deadWorkerPid = worker.process.pid;
    let deadWorkerIndex = 0;
    const deadWorker = workers.filter((worker, index) => {
      if (worker.pid === deadWorkerPid) {
        deadWorkerIndex = index;
      }
      return worker.pid === deadWorkerPid;
    });

    if (deadWorker.length) {
      const deadWorkerPort = deadWorker[0].port;
      const newWorker = cluster.fork({ PORT: deadWorkerPort });

      if (newWorker.process.pid) {
        workers.splice(deadWorkerIndex, 1, { pid: newWorker.process.pid, port: deadWorkerPort });
      } else {
        console.error(`Invalid pid for the dead worker: ${newWorker.process.pid}`);
      }
    }
  });

  startServer(PORT);
};

export { createWorkers };
