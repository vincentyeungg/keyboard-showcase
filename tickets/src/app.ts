import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@ahjoo123_tickets/common';
import { createTicketRouter } from './routes/new';

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

// custom middleware functions
app.use(currentUser);

// routes
app.use(createTicketRouter);

// for any other endpoint not specified, throw not found error
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

// error middleware
app.use(errorHandler);

export { app };