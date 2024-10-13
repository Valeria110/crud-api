import { IncomingMessage, ServerResponse } from 'node:http';
import { notFound } from '../routes/notFound';
import { IUser } from '../types/types';

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

export { isMulti, isValidReqUrl, getRequestBody };
