import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";


export async function initServer() {
  const app = express();

  app.use(bodyParser.json());
  

  app.get("/", (req, res) =>
    res.status(200).json({ message: "Everything is good" })
  );

  const graphqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            sayHello: String,
            sayHelloToMe(name: String!): String
        }
    `,
    resolvers: {
        Query: {
            sayHello: () => `Hello From Grpahql Server`,
            sayHelloToMe: (parent:any, {name}:{name:string}) => (`Hello ${name} From Grpahql Server`)
        }
    }
  });

  await graphqlServer.start();

  app.use('/graphql', expressMiddleware(graphqlServer));

  return app;
}