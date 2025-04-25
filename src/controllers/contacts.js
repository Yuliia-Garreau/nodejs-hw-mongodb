import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import { createContactSchema } from '../validation/contacts.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactsSortFields } from '../db/Models/contact.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactsSortFields);
  const filter = parseFilterParams(req.query);
  // filter.userId = req.user._id;

  const contacts = await getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  // const {
  //   data: contacts,
  //   page: currentPage,
  //   perPage: currentPerPage,
  //   totalItems,
  //   totalPages,
  //   hasNextPage,
  //   hasPreviousPage,
  // } = await getContacts({
  //   userId,
  //   page,
  //   perPage,
  //   sortBy,
  //   sortOrder,
  //   filter,
  // });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const data = await getContactById(contactId, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id=${contactId}!`,
    data: data,
  });
};

export const postContactController = async (req, res) => {
  const userId = req.user._id;
  const contact = await createContact(req.body, userId);
  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!contact) {
    next(createHttpError(404, `Contact  not found`));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully updated contact with id=${contactId}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, `Contact with id=${contactId} not found`));
    return;
  }
  res.status(204).send();
};
