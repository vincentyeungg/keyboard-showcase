import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";

const app = express();
// we are using proxy of ingress-nginx
// can trust traffic coming from ingress-nginx proxy
app.set('trust proxy', true);

app.use(json());

// need to be able to set a response of set-cookie with our JWT after
app.use(
    cookieSession({
        signed: false,
        // cookie is sent back only over https request
        // in a test environment, set secure to false to allow for simple testing
        secure: process.env.NODE_ENV !== 'test'
    })
);

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

// custom middleware functions

// error middleware
app.use(errorHandler);

export { app };