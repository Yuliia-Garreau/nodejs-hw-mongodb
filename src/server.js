import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
// import contactsRouter from './routers/contacts.js';
import router from './routers/index.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
// import { ContactsCollection } from './db/Models/contact.js';
// import dotenv from 'dotenv';
// dotenv.config();
export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(logger);

  // app.use('/contacts', contactsRouter);
  // app.use('/contacts', router);
  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
