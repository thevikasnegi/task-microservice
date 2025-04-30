import nodemailer, { Transporter } from 'nodemailer';

const {
  MAILER_SERVICE,
  NODE_MAILER_USER,
  NODE_MAILER_PASS,
} = process.env;

const transporter: Transporter = nodemailer.createTransport({
  service: MAILER_SERVICE,
  auth: {
    user: NODE_MAILER_USER,
    pass: NODE_MAILER_PASS,
  },
});

interface IEmailOptions {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({ to, subject, body }: IEmailOptions): Promise<void> => {
  if (!to || !subject || !body) {
    console.warn('Email not sent: Missing required fields.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: NODE_MAILER_USER,
      to,
      subject,
      text: body,
    });

    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};
