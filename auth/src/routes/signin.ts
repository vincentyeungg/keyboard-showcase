import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

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
  // pass request into error checking middleware
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }

    // compare the stored password of the user, and the incoming password
    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials');
    }

    // at this point, the passwords match and we can consider the user to be logged in
    // need to send back a JWT in a cookie
    // generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, 
        // env variable is already checked to ensure it is defined at this point in the application execution
        process.env.JWT_KEY!
    );

    // store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
