import path from "path";
import { nanoid } from "nanoid";
import logError from "../helpers/logError.js";
import { readFile, writeFile } from "fs/promises";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
  try {
    const contacts = await readFile(contactsPath, "utf-8");
    const response = JSON.parse(contacts);
    return response;
  } catch (error) {
    await logError(error);
    return [];
  }
}

async function writeContacts(contacts) {
  try {
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    await logError(error);
  }
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => contactId === id) || null;
  return contact;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => contactId === id);

  if (index === -1) {
    return null;
  }

  const [removedContact] = contacts.splice(index, 1);
  writeContacts(contacts);
  return removedContact;
}

export async function addContact(name, email, phone) {
  const newContact = { id: nanoid(), name, email, phone };
  const contacts = await listContacts();

  contacts.push(newContact);
  writeContacts(contacts);
  return newContact;
}

export async function updateContactById(contactId, updatedFields) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => contactId === id);

  if (index === -1) {
    return null;
  }

  const [contact] = contacts.splice(index, 1);
  const updatedContact = { ...contact, ...updatedFields };

  contacts.push(updatedContact);
  writeContacts(contacts);
  return updatedContact;
}
