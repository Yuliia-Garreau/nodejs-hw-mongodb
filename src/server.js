import express from 'express';
import pino from 'pino';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { getContactById, getContacts } from './services/contacts.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', 3000));
export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  //   app.use(
  //     pino({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     }),
  //   );

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.get('/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({ status: 200, message: 'Success, contacts found', data });
  });

  app.use('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const data = await getContactById(contactId);
    res.json({
      status: 200,
      message: `Successfully found contact with id${contactId}!`,
      data,
    });
    if (!data) {
      return res.status(404).json({
        message: `Contact with id=${contactId} was not found`,
      });
    }
    res.status(404).json({
      message: 'Not found',
    });
  });

  //   app.use('*', (req, res, next) => {
  //     res.status(404).json({
  //       message: 'Not found',
  //     });
  //   });
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
