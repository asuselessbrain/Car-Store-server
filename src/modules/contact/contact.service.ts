import sendOrderConfirmationMail from '../../utils/nodemainle';
import { contact } from './constact.model';
import { TContact } from './contact.interface';

const createContactInDb = (email: string, payload: TContact) => {
  const result = contact.create(payload);
  const emailResult = `
    <h2>A message From <strong> ${payload.name}</strong></h2>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Message:</strong> ${payload.message}</p>
    <hr/>
    <p>Thank you for reaching out!</p>
  `;
  sendOrderConfirmationMail(
    email,
    'ahmedshohagarfan@gmail.com',
    `${payload.name} want to contact you`,
    emailResult,
  );
  return result;
};

export const contactService = {
  createContactInDb,
};
