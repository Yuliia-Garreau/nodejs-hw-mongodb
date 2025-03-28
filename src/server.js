import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

// import dotenv from 'dotenv';

import { getEnvVar } from './utils/getEnvVar.js';

import { getContactById, getContacts } from './services/contacts.js';
// import { ContactsCollection } from './db/Models/contact.js';

// dotenv.config();

// const PORT = Number(getEnvVar('PORT', 3000));
export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  //   const logger = pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   });

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const data = await getContactById(contactId);

    if (data === null) {
      return res.status(404).json({
        message: `Contact not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id${contactId}!`,
      data: data,
    });

    // res.status(404).json({
    //   message: 'Not found',
    // });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
