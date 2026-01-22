import sendOrderConfirmationMail from '../../utils/nodemainle';
import { contact } from './constact.model';
import { TContact } from './contact.interface';

const createContactInDb = (email: string, payload: TContact) => {
  const result = contact.create(payload);
  const emailResult = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 24px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
    <h2 style="text-align: center; color: #1a202c;">📩 New Contact Request - AutoSphere</h2>
    
    <p style="font-size: 16px; color: #333;">Hello Admin,</p>
    <p style="font-size: 15px; color: #444;">You have received a new message from the contact form on <strong>AutoSphere</strong>:</p>
    
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 15px;">
      <tr>
        <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Name:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${payload.email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Message:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${payload.message}</td>
      </tr>
    </table>

    <p style="margin-top: 30px; font-size: 14px; color: #555;">
      Please respond to this message as soon as possible.
    </p>

    <hr style="margin: 30px 0;" />
    <div style="text-align: center; font-size: 13px; color: #999;">
      📍 AutoSphere Customer Support <br/>
      &copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.
    </div>
  </div>
`;

  const autoReply = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fefefe;">
  <h2 style="color: #2c3e50; text-align: center;">🤝 Thank You for Contacting AutoSphere</h2>

  <p style="font-size: 16px; color: #333;">Hi ${payload.name},</p>

  <p style="font-size: 15px; color: #444;">
    We’ve received your message and want to thank you for reaching out to <strong>AutoSphere</strong>. Our support team is currently reviewing your request and will get back to you as soon as possible.
  </p>

  <p style="font-size: 15px; color: #444;">Here is a summary of your message:</p>

  <table style="width: 100%; margin-top: 16px; border-collapse: collapse; font-size: 15px;">
    <tr>
      <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Your Name:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${payload.name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Your Email:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${payload.email}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background-color: #f6f6f6; border: 1px solid #ddd;"><strong>Your Message:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${payload.message}</td>
    </tr>
  </table>

  <p style="margin-top: 20px; font-size: 14px; color: #555;">
    If you have any urgent inquiries, feel free to email us directly at <a href="mailto:support@autosphere.com">support@autosphere.com</a>.
  </p>

  <p style="font-size: 14px;">Warm regards,<br/><strong>The AutoSphere Team</strong></p>

  <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #999;">
    &copy; ${new Date().getFullYear()} AutoSphere. All rights reserved.
  </div>
</div>
`;

  sendOrderConfirmationMail(
    email,
    'ahmedshohagarfan@gmail.com',
    `${payload.name} submitted a contact request via AutoSphere`,
    emailResult,
  );
  sendOrderConfirmationMail(
    'ahmedshohagarfan@gmail.com',
    payload?.email,
    'We’ve Received Your Message – AutoSphere Support',
    autoReply,
  );
  return result;
};

export const contactService = {
  createContactInDb,
};
