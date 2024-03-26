"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const db_1 = require("./lib/db");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 8000;
        const gqlServer = new server_1.ApolloServer({
            typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): String
      }
    `,
            resolvers: {
                Query: {
                    hello: () => `Hey there, I am the GraphQL server!`,
                    say: (_, { name }) => `Hello, ${name}!`,
                },
                Mutation: {
                    createUser: (_1, _a) => __awaiter(this, [_1, _a], void 0, function* (_, { firstName, lastName, email, password, }) {
                        // Your createUser resolver logic goes here
                        yield db_1.prismaClient.user.create({
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: 'random_salt',
                            },
                        });
                        return `User created: ${firstName} ${lastName}`;
                    }),
                },
            },
        });
        yield gqlServer.start();
        app.use('/graphql', express_1.default.json(), (0, express4_1.expressMiddleware)(gqlServer));
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/graphql`);
        });
    });
}
init().catch((error) => console.error(error));
