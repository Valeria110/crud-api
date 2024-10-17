import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from '../types/types';
import { handleDeleteReq, handleGetUser, handleGetUsers, handlePostReq, handlePutRequest } from './handleRequests';

const userId = '6b1cab7f-d5e6-45b3-a691-68541082929b';
jest.mock('uuid', () => {
  const id = '6b1cab7f-d5e6-45b3-a691-68541082929b';
  return {
    v4: jest.fn().mockReturnValue(id),
    validate: jest.fn().mockReturnValue(true),
  };
});

describe('http requests', () => {
  const userData: Omit<IUser, 'id'> = {
    username: 'Valerie',
    age: 21,
    hobbies: ['reading', 'singing'],
  };
  const reqUrl = `/api/users/${userId}`;

  const mockedUsers = new Map<string, IUser>();
  jest.mock('./users', () => {
    return {
      getUsers: jest.fn().mockReturnValue(mockedUsers),
      getUserById: jest.fn().mockReturnValue(mockedUsers.get(userId)),
      addUser: jest.fn().mockImplementation(() => mockedUsers.set(userId, { ...userData, id: userId })),
      deleteUserById: jest.fn().mockImplementation(() => mockedUsers.delete(userId)),
    };
  });

  let req: IncomingMessage;
  let res: ServerResponse;

  beforeEach(() => {
    req = {
      on: jest.fn((event: string, callback: (chunk?: string) => void) => {
        if (event === 'data') {
          callback(JSON.stringify(userData));
        }
        if (event === 'end') callback();
      }),
    } as unknown as IncomingMessage;

    res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array with GET request when called for the first time', () => {
    handleGetUsers(res);
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify([]));
  });

  it('should create a new user with POST request', () => {
    handlePostReq(req, res);
    expect(res.writeHead).toHaveBeenCalledWith(201, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ id: userId, ...userData }));
  });

  it('should return a user by an id with GET request', () => {
    handleGetUser(userId, res);
    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ id: userId, ...userData }));
  });

  it('should update user data with PUT request', () => {
    const updatedUserData = { ...userData, username: 'Masha' };

    req = {
      on: jest.fn((event: string, callback: (chunk?: string) => void) => {
        if (event === 'data') {
          callback(JSON.stringify(updatedUserData));
        }
        if (event === 'end') callback();
      }),
      url: `/api/users/${userId}`,
    } as unknown as IncomingMessage;

    handlePutRequest(req, res);
    expect(res.writeHead).toHaveBeenCalledWith(201, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ id: userId, ...updatedUserData }));
  });

  it('should delete a user with a specific id', () => {
    req = {
      url: reqUrl,
    } as unknown as IncomingMessage;
    handleDeleteReq(reqUrl, res);
    expect(res.writeHead).toHaveBeenCalledWith(204, 'User deleted and found succesfully', {
      'Content-Type': 'application/json',
    });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: `User with id${userId} is deleted` }));
  });

  it('should return a response that a deleted user with such an id does not exist', () => {
    handleDeleteReq(reqUrl, res);
    expect(res.writeHead).toHaveBeenCalledWith(404, 'User with this id does not exist');
    expect(res.end).toHaveBeenCalled();
  });
});
