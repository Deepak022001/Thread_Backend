// import UserService, { createUserPayload } from '../services/user';
import { UserService, createUserPayload } from '../services/user';
const queries = {};
const mutations = {
  createUser: async (_: any, payload: createUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};
export const resolvers = { queries, mutations };
