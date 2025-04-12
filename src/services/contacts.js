// import { sortList } from '../constants/index.js';
import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/Models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
export const getContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  // const contactsCount = await ContactsCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments();

  // const contacts = await contactsQuery
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({
  //     [sortBy]: sortOrder,
  //   })
  //   .exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (contactId) =>
  ContactsCollection.findOne({ _id: contactId });

// export const createContact = async (payload) => {
//   const contact = await ContactsCollection.create(payload);
//   return contact;
// };
export const createContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async (contactId, payload) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    { $set: payload },
  );

  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });

  return contact;
};
