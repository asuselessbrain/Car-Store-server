import { model, Schema } from 'mongoose';
import { TContact } from './contact.interface';

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

export const contact = model<TContact>('contact', contactSchema);
