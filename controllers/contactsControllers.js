import {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { controllerWrapper } from "../decorators/controllerWrapper.js";

async function getAllContacts(req, res, next) {
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-owner";
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const settingsParams = { skip, limit };

  const contacts = await listContacts({
    filter,
    fields,
    settingsParams,
  });
  res.status(200).json(contacts);
}

async function getOneContact(req, res, next) {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const fields = "-owner";
  const contact = await getContactById({ _id, owner }, fields);
  if (!contact) {
    throw HttpError(404);
  }
  res.status(200).json(contact);
}

async function deleteContact(req, res, next) {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const removedContact = await removeContact({ _id, owner });

  if (!removedContact) {
    throw HttpError(404);
  }

  res.status(200).json(removedContact);
}

async function createContact(req, res, next) {
  console.log("user: ", req.user);
  const { _id: owner } = req.user;
  const { name, email, phone, favorite = false } = req.body;

  if (!name || !email || !phone) {
    throw HttpError(400, "Body must have name, email, and phone fields");
  }

  const newContact = await addContact({ owner, name, email, phone, favorite });

  res.status(201).json(newContact);
}

async function updateContact(req, res, next) {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
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

  const updatedContact = await updateContactById({ _id, owner }, updatedFields);

  if (!updatedContact) {
    throw HttpError(404);
  }

  res.status(200).json(updatedContact);
}

const updateStatusContact = async (req, res, next) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { favorite = null } = req.body;

  if (favorite === null) {
    throw HttpError(400, "Body must have favorite field");
  }

  const updatedContact = await updateContactById({ _id, owner }, { favorite });

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
