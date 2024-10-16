interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface IWorker {
  pid: number;
  port: number;
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500,
}

export { IUser, IWorker, HttpMethod, StatusCode };
