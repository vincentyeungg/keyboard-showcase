import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// error handler function needs to have 4 arguments
// this error handler middleware functions returns a structured format for errors caught
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    // any of our custom errors must extend CustomError class
    if (err instanceof CustomError) {
        // return the error once confirmed it is of instanceof, and return the assembled errors
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
};