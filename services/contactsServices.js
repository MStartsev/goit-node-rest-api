import Contact from "../models/contact.js";

export const listContacts = async () => await Contact.find();

export const getContactById = async (_id) => await Contact.findById(_id);

export const removeContact = async (_id) =>
  await Contact.findByIdAndDelete(_id);

export const addContact = async (body) => Contact.create(body);

export const updateContactById = async (_id, updatedFields) =>
  Contact.findByIdAndUpdate(_id, updatedFields);
