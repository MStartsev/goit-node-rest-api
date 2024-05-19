import {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { controllerWrapper } from "../decorators/controllerWrapper.js";

async function getAllContacts(_, res, next) {
  const contacts = await listContacts();
  console.log(contacts);
  res.status(200).json(contacts);
}

async function getOneContact(req, res, next) {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  const removedContact = await removeContact(id);

  if (!removedContact) {
    throw HttpError(404);
  }

  res.status(200).json(removedContact);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite = false } = req.body;

  if (!name || !email || !phone) {
    throw HttpError(400, "Body must have name, email, and phone fields");
  }

  const newContact = await addContact({ name, email, phone, favorite });

  res.status(201).json(newContact);
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const { name, email, phone, favorite = null } = req.body;

  const updatedFields = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(favorite !== null && { favorite }),
  };

  if (!Object.keys(updatedFields).length) {
    throw HttpError(400, "Body must have at least one field");
  }

  const updatedContact = await updateContactById(id, updatedFields);

  if (!updatedContact) {
    throw HttpError(404);
  }

  res.status(200).json(updatedContact);
}

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite = null } = req.body;

  if (favorite === null) {
    throw HttpError(400, "Body must have favorite field");
  }

  const updatedContact = await updateContactById(id, { favorite });

  if (updatedContact) {
    return res.status(200).json(updatedContact);
  }
  throw HttpError(404, "Not found");
};

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  deleteContact: controllerWrapper(deleteContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
