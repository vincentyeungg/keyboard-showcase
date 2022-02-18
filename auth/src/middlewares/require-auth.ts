import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    // if currentUser is valid, then pass it along next chain of middlewares
    next();
};
