import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string;
    email: string;
}

// alter the request object to add an additional optional property of type UserPayload
// this way, we can now add a new property of currentUser on the req object from Express
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if there is no session object or no jwt defined
  if (!req.session?.jwt) {
    // pass it to the next chain of middlewares
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;

    // add a currentUser property on the req object, need to augment req object properties to add additional optional property 'currentUser'
    req.currentUser = payload;
  } catch (error) {}

  // pass it to next chain of middleware regardless
  next();
};
