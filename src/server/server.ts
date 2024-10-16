import http from 'node:http';
import { handleServerError } from '../routes/handleServerError';
import { isValidReqUrl } from '../utils';
import { handleDeleteReq, handleGetReq, handlePostReq, handlePutRequest } from '../api/handleRequests';
import { HttpMethod } from '../types/types';

const startServer = (PORT: number) => {
  const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    if (isValidReqUrl(req.url, res)) {
      const method = req.method;

      try {
        switch (method) {
          case HttpMethod.GET:
            handleGetReq(req.url as string, res);
            break;
          case HttpMethod.POST:
            handlePostReq(req, res);
            break;
          case HttpMethod.PUT:
            handlePutRequest(req, res);
            break;
          case HttpMethod.DELETE:
            handleDeleteReq(req.url as string, res);
            break;
        }
      } catch {
        handleServerError(res);
      }
    }
  });

  server.listen(PORT, (err?: Error): void => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      console.log(`Server ${process.pid} is listening on port ${PORT}`);
    }
  });
};

export { startServer };
