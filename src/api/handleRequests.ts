import { IncomingMessage, ServerResponse } from 'node:http';
import { addUser, getUserById, getUsers } from './users';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { IUser } from '../types/types';
import { getRequestBody } from '../utils/utils';
import { serverError } from '../routes/serverError';

const handleGetReq = (reqUrl: string, res: ServerResponse) => {
  const urlSegments = reqUrl.split('/').slice(1);
  const isOneUser = urlSegments.length === 3;

  if (isOneUser) {
    const userId = urlSegments[2];
    handleGetUser(userId, res);
  } else {
    handleGetUsers(res);
  }
};

const handleGetUser = (userId: string, res: ServerResponse) => {
  if (uuidValidate(userId)) {
    const user = getUserById(userId) ?? null;

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, 'User with this id does not exist');
      res.end();
    }
  } else {
    res.writeHead(400, 'Invalid user id');
    res.end();
  }
};

const handleGetUsers = (res: ServerResponse) => {
  const users = getUsers();
  const usersJSONFormat = JSON.stringify([...[...users.entries()].map((user) => user[1])]);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(usersJSONFormat);
};

const handlePostReq = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);

      if (!parsedBody.username || !parsedBody.age || !parsedBody.hobbies) {
        res.writeHead(400, 'Invalid data', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Username, age and hobbies are required' }));
        return;
      }

      const newUser: IUser = { id: uuidv4(), ...parsedBody };
      addUser(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      serverError(res);
    }
  });

  req.on('error', () => {
    serverError(res);
  });
};

export { handleGetReq, handlePostReq };
