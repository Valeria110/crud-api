import { IUser } from '../types/types';

const users = new Map<string, IUser>();

const getUsers = () => {
  return users;
};

const getUserById = (userId: string) => {
  return users.get(userId);
};

const addUser = (newUserData: IUser) => {
  users.set(newUserData.id, newUserData);
};

// JSON:
// {
//     "username": "Valerie",
//     "age": "21",
//     "hobbies": "['reading', 'programming']"
//   }

export { getUsers, addUser, getUserById };
