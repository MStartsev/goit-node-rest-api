import {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export async function getAllContacts(_, res, next) {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: "success",
      code: 200,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json({
      status: "success",
      code: 200,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);

    if (!removedContact) {
      throw HttpError(404);
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: removedContact,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      throw HttpError(400, "Body must have name, email, and phone fields");
    }

    const newContact = await addContact(name, email, phone);

    res.status(201).json({
      status: "success",
      code: 201,
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const { name = null, email = null, phone = null } = req.body;

    if (!name && !email && !phone) {
      throw HttpError(400, "Body must have at least one field");
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;

    const updatedContact = await updateContactById(id, updatedFields);

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}
