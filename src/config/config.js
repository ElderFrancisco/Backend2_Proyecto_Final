import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  privatekey: process.env.PRIVATEKEY,
  logger_console_level: process.env.LOGGER_CONSOLE_LEVEL,
  logger_file_level: process.env.LOGGER_FILE_LEVEL,
  mongo_url: process.env.MONGO_URL,
  mongo_name: process.env.MONGO_NAME,
  persistence: process.env.PERSISTENCE,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  baseUrl: process.env.BASE_URL,
  stripeKey: process.env.STRIPE_KEY,
};
