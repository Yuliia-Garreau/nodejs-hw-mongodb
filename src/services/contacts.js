import { ContactsCollection } from '../db/Models/contact.js';
export const getContacts = () => ContactsCollection.find();

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
    { new: true },
  );

  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });

  return contact;
};
