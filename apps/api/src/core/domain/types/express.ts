// Extend Express Request type to include fingerprint property
declare global {
  namespace Express {
    interface Request {
      fingerprint?: string;
    }
  }
}

export {};
