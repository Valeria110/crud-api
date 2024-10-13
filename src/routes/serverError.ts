import { ServerResponse } from 'http';

const serverError = (res: ServerResponse) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};

export { serverError };
