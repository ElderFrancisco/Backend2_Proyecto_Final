import winston from 'winston';
import config from '../config/config.js';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: config.logger_console_level }),
    new winston.transports.File({
      filename: './errors.log',
      level: config.logger_file_level,
    }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `[${req.method}]${req.url} - ${new Date().toLocaleTimeString()}`,
  );
  next();
};

export { logger, addLogger };
