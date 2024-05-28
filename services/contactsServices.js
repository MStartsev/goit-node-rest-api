import Contact from "../models/contact.js";

export const listContacts = async (search = {}) => {
  const { filter = {}, fields = "", settings = {} } = search;
  return await Contact.find(filter, fields, settings);
};

export const getContactById = async (filter) => await Contact.findOne(filter);

export const removeContact = async (filter) =>
  await Contact.findOneAndDelete(filter);

export const addContact = async (body) => await Contact.create(body);

export const updateContactById = async (filter, body) =>
  await Contact.findOneAndUpdate(filter, body, { new: true });
