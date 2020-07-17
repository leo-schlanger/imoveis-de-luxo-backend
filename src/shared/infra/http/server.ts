import 'reflect-metadata';
import 'dotenv/config';

import express, { Response, Request, NextFunction } from 'express';
import { errors } from 'celebrate';
import cors from 'cors';

import 'express-async-errors';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErrors';
import { UserResolver } from '@modules/users/infra/graphql/resolvers/UserResolver';
import { PlanResolver } from '@modules/users/infra/graphql/resolvers/PlanResolver';
import { AddressResolver } from '@modules/adresses/infra/graphql/resolvers/AddressResolver';
import { PropertyResolver } from '@modules/properties/infra/graphql/resolvers/PropertyResolver';

import rateLimiter from './middlewares/rateLimiter';

import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

(async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/files', express.static(uploadConfig.uploadsFolder));
  app.use(rateLimiter);
  app.use(routes);

  app.use(errors());

  app.use(
    (err: Error, request: Request, response: Response, _: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      console.error(err);

      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    },
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        PlanResolver,
        AddressResolver,
        PropertyResolver,
      ],
    }),
    context: ({ req, res }) => ({ req, res, user: req.user }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(3333, () => {
    console.log('🚀 Server started on port 3333!');
  });
})();
