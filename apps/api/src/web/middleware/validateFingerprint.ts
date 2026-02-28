import { Request, Response, NextFunction } from 'express';
import { logWarn } from '@config/logger';

/**
 * Middleware to extract and validate browser fingerprint from request
 * Fingerprint can be sent via:
 * 1. Request header: X-Browser-Fingerprint
 * 2. Request body: fingerprint field
 */
export const extractFingerprint = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers['x-request-id'];

  // Try to get fingerprint from header first
  let fingerprint = req.headers['x-browser-fingerprint'] as string;

  // If not in header, try body
  if (!fingerprint && req.body && req.body.fingerprint) {
    fingerprint = req.body.fingerprint;
  }

  if (!fingerprint || fingerprint.trim().length === 0) {
    logWarn('Missing browser fingerprint', {
      requestId,
      url: req.url,
      method: req.method,
    });

    res.status(400).json({
      success: false,
      message: 'Browser fingerprint is required',
      error:
        'Please provide fingerprint in X-Browser-Fingerprint header or request body',
    });
    return;
  }

  // Validate fingerprint format (should be alphanumeric, 10-255 characters)
  if (fingerprint.length < 10 || fingerprint.length > 255) {
    logWarn('Invalid fingerprint length', {
      requestId,
      fingerprintLength: fingerprint.length,
    });

    res.status(400).json({
      success: false,
      message: 'Invalid fingerprint format',
      error: 'Fingerprint must be between 10 and 255 characters',
    });
    return;
  }

  // Basic sanitization - remove any special characters that could be harmful
  const sanitizedFingerprint = fingerprint.replace(/[^\w-]/g, '');

  if (sanitizedFingerprint.length < 10) {
    logWarn('Fingerprint contains invalid characters', {
      requestId,
      original: fingerprint,
    });

    res.status(400).json({
      success: false,
      message: 'Invalid fingerprint format',
      error: 'Fingerprint contains invalid characters',
    });
    return;
  }

  // Attach sanitized fingerprint to request object
  req.fingerprint = sanitizedFingerprint;

  next();
};

/**
 * Rate limiting per fingerprint (optional, for production use)
 * Limits the number of requests per fingerprint per time window
 */
const fingerprintRequestMap = new Map<
  string,
  { count: number; resetTime: number }
>();

export const rateLimitByFingerprint = (
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.fingerprint) {
      next();
      return;
    }

    const now = Date.now();
    const fingerprint = req.fingerprint;
    const requestData = fingerprintRequestMap.get(fingerprint);

    if (!requestData || now > requestData.resetTime) {
      // First request or window has expired - reset
      fingerprintRequestMap.set(fingerprint, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (requestData.count >= maxRequests) {
      logWarn('Rate limit exceeded for fingerprint', {
        fingerprint,
        count: requestData.count,
        limit: maxRequests,
      });

      res.status(429).json({
        success: false,
        message: 'Too many requests',
        error: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds`,
      });
      return;
    }

    // Increment count
    requestData.count += 1;
    fingerprintRequestMap.set(fingerprint, requestData);

    next();
  };
};

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  fingerprintRequestMap.forEach((value, key) => {
    if (now > value.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => fingerprintRequestMap.delete(key));
}, 5 * 60 * 1000);
