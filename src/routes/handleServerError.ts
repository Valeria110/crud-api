import { ServerResponse } from 'http';
import { StatusCode } from '../types/types';

const handleServerError = (res: ServerResponse) => {
  res.writeHead(StatusCode.ServerError, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Internal Server Error' }));
};

export { handleServerError };
