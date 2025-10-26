import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { morganStream } from '../config/logger';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Define custom Morgan tokens
morgan.token('request-id', (req: Request) => req.headers['x-request-id'] as string);

// Production format: Structured for Grafana/Loki parsing
const productionFormat =
  ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms - request_id=:request-id';

// Development format: Simple and readable
const developmentFormat = ':method :url :status :response-time ms';

// Skip logging for health check endpoints
const shouldSkipLogging = (req: Request) => {
  const skipPaths = ['/health', '/favicon.ico'];
  return skipPaths.includes(req.path);
};

// HTTP request logging middleware
export const httpLogger = morgan(
  isProduction ? productionFormat : developmentFormat,
  {
    stream: morganStream,
    skip: shouldSkipLogging,
  }
);

// Request ID middleware - adds unique ID to each request for tracing
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};
