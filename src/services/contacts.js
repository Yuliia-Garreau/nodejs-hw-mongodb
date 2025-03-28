import { ContactsCollection } from '../db/Models/contact.js';
export const getContacts = () => ContactsCollection.find();

export const getContactById = (contactId) =>
  ContactsCollection.findOne({ _id: contactId });
