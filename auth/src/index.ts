import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
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

const _PORT = 3000;
app.use(json());
// need to be able to set a response of set-cookie with our JWT after
app.use(
    cookieSession({
        signed: false,
        secure: true
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

const start = async () => {
    // ensure all environment variables we need to use are defined and available 
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        // connect to mongodb in our auth-mongo pod using the cluster ip service created
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    } catch (err) {
        console.error(err);
    }

    console.log('connected to mongodb');

    app.listen(_PORT, () => {
        console.log(`Listening on port ${_PORT}...`);
    });
};

// connect to db, and listen on configured port for traffic
start();