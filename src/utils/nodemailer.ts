import nodemailer from 'nodemailer';

const config = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_OWNER_EMAIL,
    pass: process.env.NODEMAILER_OWNER_PASSWORD
  }
};

// eslint-disable-next-line prettier/prettier
export const transporter = nodemailer.createTransport(config);
