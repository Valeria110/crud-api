import http from 'node:http';
import { serverError } from '../routes/serverError';
import { isMulti, isValidReqUrl } from '../utils/utils';
import { handleDeleteReq, handleGetReq, handlePostReq, handlePutRequest } from '../api/handleRequests';

const startServer = (PORT: string) => {
  const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    const isMultiMode = isMulti();

    if (isValidReqUrl(req.url, res)) {
      const method = req.method;

      try {
        switch (method) {
          case 'GET':
            handleGetReq(req.url as string, res);
            break;
          case 'POST':
            handlePostReq(req, res);
            break;
          case 'PUT':
            handlePutRequest(req, res);
            break;
          case 'DELETE':
            handleDeleteReq(req.url as string, res);
            break;
        }
      } catch {
        serverError(res);
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
