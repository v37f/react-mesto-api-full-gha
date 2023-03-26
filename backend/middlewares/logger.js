const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'request.log',
      dirname: 'logs',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    winston.format.printf(
      (info) => JSON.stringify(info).replace(/\\n/g, '\\n').replace(/\\t/g, '\\t'),
    ),
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      dirname: 'logs',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    winston.format.printf(
      (info) => JSON.stringify(info).replace(/\\n/g, '\\n').replace(/\\t/g, '\\t'),
    ),
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
