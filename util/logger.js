const morgan = require('morgan');

morgan.token('ip', (req) => req.ip || req.connection.remoteAddress);

const format = 'User Ip: :ip - Method: :method - Endpoint: :url - Status: :status - Time: :response-time ms';

const logger = morgan(format);

module.exports = logger;
