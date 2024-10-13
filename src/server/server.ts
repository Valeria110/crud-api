import http from 'node:http';
import { notFound } from '../routes/notFound';
import { serverError } from '../routes/serverError';
import { isMulti, isValidReqUrl } from '../utils/utils';
import { addUser } from '../api/users';
import { IUser } from '../types/types';
import { handleGetReq, handlePostReq } from '../api/handleRequests';

const startServer = (PORT: string) => {
  const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    const isMultiMode = isMulti();

    if (isValidReqUrl(req.url, res)) {
      const method = req.method;

      const data = JSON.stringify({
        users: [
          { name: 'John', age: 21 },
          { name: 'Lera', age: 21 },
        ],
      });

      try {
        switch (method) {
          case 'GET':
            handleGetReq(req.url as string, res);
            break;
          case 'POST':
            handlePostReq(req, res);
            break;
          case 'PUT':
            console.log('method: ', method);
            break;
          case 'DELETE':
            console.log('method: ', method);
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
      process.exit;
    } else {
      console.log(`Server ${process.pid} is listening on port ${PORT}`);
    }
  });
};

export { startServer };
