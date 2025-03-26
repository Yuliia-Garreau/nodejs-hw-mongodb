import { ContactsCollection } from '../db/Models/contact.js';
export const getContacts = () => ContactsCollection.find({});
export const getContactById = (id) => ContactsCollection.findOne({ _id: id });
