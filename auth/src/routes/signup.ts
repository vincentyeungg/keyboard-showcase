import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

import { RequestValidationError } from "../errors/request-validation";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post("/api/users/signup", [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ], 
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        // if there are any errors picked up from express-validator
        if (!errors.isEmpty()) {
            // throw the error, the error middleware will handle the error there
            throw new RequestValidationError(errors.array());
        }

        // check if user with email already exists
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        // create the new user object and save it in the db
        const user = User.build({ email, password });
        await user.save();

        // generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, 
            // env variable is already checked to ensure it is defined at this point in the application execution
            process.env.JWT_KEY!
        );

        // store it on session object
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
});

export { router as signupRouter };