import { Request } from 'express';

declare module 'express' {
  interface Request {
    session?: Express.Session & Express.SessionData;
  }
}
