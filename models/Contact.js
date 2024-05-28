import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

contactSchema.methods.toJSON = function () {
  const contact = this;
  const contactObject = contact.toObject();

  delete contactObject.owner;
  return contactObject;
};

contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
