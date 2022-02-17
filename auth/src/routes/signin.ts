import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { RequestValidationError } from "../errors/request-validation";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  (req: Request, res: Response) => {
      const errors = validationResult(req);

      // if there are any errors in the request body parameters
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }

      res.status(201).send({});
  }
);

export { router as signinRouter };