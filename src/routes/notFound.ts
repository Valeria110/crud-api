import { ServerResponse } from 'http';

const notFound = (res: ServerResponse) => {
  res.writeHead(404, 'Non-existing endpoint', { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
};

export { notFound };
