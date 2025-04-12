import { Schema } from 'mongoose';
import { model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: typeList,
      default: typeList[0],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// contactSchema.post('save', (doc, next) => doc.populate('contactType').execPopulate());
contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactsSortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavorite',
  'contactType',
];

export const ContactsCollection = model('contacts', contactSchema);
