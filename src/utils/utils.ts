import { IncomingMessage, ServerResponse } from 'node:http';
import { notFound } from '../routes/notFound';
import { IUser } from '../types/types';
import { validate as uuidValidate } from 'uuid';
import { getUserById } from '../api/users';

const isMulti = () => {
  return process.argv.slice(2).includes('--multi');
};

const isValidReqUrl = (reqUrl: string | undefined, res: ServerResponse) => {
  if (!reqUrl) {
    notFound(res);
    return false;
  } else {
    const urlSegments = reqUrl.split('/').slice(1) ?? null;

    if (!reqUrl.startsWith(process.env.BASE_END_POINT as string) && urlSegments?.length === 2) {
      notFound(res);
      return false;
    } else if (urlSegments.length > 3) {
      notFound(res);
      return false;
    }
  }

  return true;
};

const getRequestBody = (req: IncomingMessage): Promise<Omit<IUser, 'id'>> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

const isValidUserId = (userId: string, res: ServerResponse) => {
  if (uuidValidate(userId)) {
    const user = getUserById(userId) ?? null;

    if (user) {
      return true;
    } else {
      res.writeHead(404, 'User with this id does not exist');
      res.end();
      return false;
    }
  } else {
    res.writeHead(400, 'Invalid user id');
    res.end();
    return false;
  }
};

const isValidBody = (body: unknown) => {
  const allowedKeys = ['username', 'age', 'hobbies'];
  const invalidKeys = Object.keys(body as object).filter((key) => !allowedKeys.includes(key));

  return !(invalidKeys.length > 0);
};

export { isMulti, isValidReqUrl, getRequestBody, isValidUserId, isValidBody };
