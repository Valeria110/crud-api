# :computer: Crud-api
## Installation
Run the following command to install all dependencies:
```npm
npm install
```
## Scripts
There are the following scripts in the app:

- `start:dev` - run the development mode;
- `start:prod` - run the production mode;

Run the application with multiple instances using the Node.js Cluster API with a **load balancer** that distributes requests across them (using Round-robin algorithm): 
- `start:multi:dev` - run the development mode with horizontal scaling;
- `start:multi:prod` - run the production mode with horizontal scaling;

- `prettier-fix` - format code
- `lint` - check code with eslint
- `test` - run tests

## .env file configuration
Create an `.env` file with `PORT` (port on which the server will run; the default value - 4000) and `BASE_END_POINT` (the base endpoint of API). The example is provided in the `.env.example` file.

## API docs
- **GET** `api/users` is used to get all persons
  - Server should answer with `status code` **200** and all users records
- **GET** `api/users/{userId}` 
  - Server answers with `status code` **200** and record with `id === userId` if it exists
  - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
  - Server answers with `status code` **201** and newly created record
  - Server answers with `status code` **400** and corresponding message if request `body` does not contain **required** fields
- **PUT** `api/users/{userId}` is used to update existing user
  - Server answers with` status code` **200** and updated record
  - Server answers with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to delete existing user from database
  - Server answers with `status code` **204** if the record is found and deleted
  - Server answers with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
  - Server answers with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

Users are stored as `objects` that have the following properties:
- `id` — unique identifier (`string`, `uuid`) generated on server side
- `username` — user's name (`string`, **required**)
- `age` — user's age (`number`, **required**)
- `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
