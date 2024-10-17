import { IncomingMessage, ServerResponse } from 'node:http';
import { addUser, deleteUserById, getUserById, getUsers, updateUser } from './users';
import { v4 as uuidv4 } from 'uuid';
import { IUser, StatusCode } from '../types/types';
import { isValidBody, isValidUserId } from '../utils';
import { handleServerError } from '../routes/handleServerError';

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
  if (isValidUserId(userId, res)) {
    const user = getUserById(userId);
    res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  }
};

const handleGetUsers = (res: ServerResponse) => {
  const users = getUsers();
  const usersJSONFormat = JSON.stringify([...[...users.entries()].map((user) => user[1])]);
  res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
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
        res.writeHead(StatusCode.BadRequest, 'Invalid data', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Username, age and hobbies are required' }));
        return;
      }

      const newUser: IUser = { id: uuidv4(), ...parsedBody };
      addUser(newUser);
      res.writeHead(StatusCode.Created, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch {
      handleServerError(res);
    }
  });

  req.on('error', () => {
    handleServerError(res);
  });
};

const handlePutRequest = (req: IncomingMessage, res: ServerResponse) => {
  const userId = (req.url as string).split('/').slice(1)[2];
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      if (isValidBody(parsedBody)) {
        if (isValidUserId(userId, res)) {
          const updatedUser = updateUser(parsedBody, userId);
          res.writeHead(StatusCode.Created, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        }
      } else {
        res.writeHead(StatusCode.BadRequest, 'Invalid data', { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'A user can only contain username, age and hobbies fields' }));
      }
    } catch {
      handleServerError(res);
    }
  });

  req.on('error', () => {
    handleServerError(res);
  });
};

const handleDeleteReq = (reqUrl: string, res: ServerResponse) => {
  const userId = reqUrl.split('/').slice(1)[2];
  if (isValidUserId(userId, res)) {
    deleteUserById(userId);
    res.writeHead(StatusCode.NoContent, 'User deleted and found succesfully', { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `User with id${userId} is deleted` }));
  }
};

export { handleGetReq, handleGetUsers, handleGetUser, handlePostReq, handlePutRequest, handleDeleteReq };
