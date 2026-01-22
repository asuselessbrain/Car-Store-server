import nodemailer from 'nodemailer';

const sendOrderConfirmationMail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
  attachment?: { filename: string; content: Buffer },
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'ahmedshohagarfan@gmail.com',
      pass: 'bsczewckcuixpdvv',
    },
  });

  const mailOptions: any = {
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: 'Hello world?', // plain text body
    html: html, // html body
  };

  if (attachment) {
    mailOptions.attachments = [attachment];
  }

  // send mail with defined transport object
  await transporter.sendMail(mailOptions);
};

export default sendOrderConfirmationMail;
