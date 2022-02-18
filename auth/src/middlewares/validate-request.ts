import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    // if there are any errors picked up from express-validator
    if (!errors.isEmpty()) {
        // throw the error, the error middleware will handle the error there
        throw new RequestValidationError(errors.array());
    }

    next();
};