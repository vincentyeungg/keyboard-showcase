import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const _PORT = 3000;

const start = async () => {
    // ensure all environment variables we need to use are defined and available 
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    try {
        // from NATS -> (cluster ID, unique client id, nats streaming url where it is hosting the cluster)
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        // ensure that nats service is closed fully when it detects nats client connection is closed
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            // end this process, don't do anything else
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // connect to mongodb in our tickets-mongo pod using the cluster ip service created
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