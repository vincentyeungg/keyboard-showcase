import mongoose from 'mongoose';

import { app } from './app';

const _PORT = 3000;

const start = async () => {
    // ensure all environment variables we need to use are defined and available 
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        // connect to mongodb in our auth-mongo pod using the cluster ip service created
        await mongoose.connect(process.env.MONGO_URI);
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