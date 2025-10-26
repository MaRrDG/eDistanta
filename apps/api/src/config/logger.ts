import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors for console output in development
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Determine the current environment
const isProduction = process.env.NODE_ENV === 'production';

// Define log level based on environment
const level = () => {
  return isProduction ? 'http' : 'debug';
};

// JSON format for production (Grafana/Loki)
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Simple readable format for development
const developmentFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    (info) => {
      let message = `${info.timestamp} [${info.level}]: ${info.message}`;

      // Add metadata if present
      if (info.metadata && Object.keys(info.metadata).length > 0) {
        message += ` ${JSON.stringify(info.metadata)}`;
      }

      // Add stack trace for errors
      if (info.stack) {
        message += `\n${info.stack}`;
      }

      return message;
    }
  )
);

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format: isProduction ? productionFormat : developmentFormat,
  transports: [
    new winston.transports.Console(),
  ],
  exitOnError: false,
});

// Create a stream object for Morgan (HTTP request logger)
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export helper methods for different log levels
export const logError = (message: string, meta?: any) => {
  logger.error(message, meta ? { metadata: meta } : {});
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta ? { metadata: meta } : {});
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta ? { metadata: meta } : {});
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta ? { metadata: meta } : {});
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta ? { metadata: meta } : {});
};

export default logger;
