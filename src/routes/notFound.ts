import { ServerResponse } from 'http';
import { StatusCode } from '../types/types';

const notFound = (res: ServerResponse) => {
  res.writeHead(StatusCode.NotFound, 'Non-existing endpoint', { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
};

export { notFound };
