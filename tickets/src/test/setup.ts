import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
    var getCookie: () => string[];
}

// tell Jest to use the fake file in our test file for the fake implementation of NATS
jest.mock('../nats-wrapper');

// hook function to be called at the start of test script
beforeAll(async () => {
    // using a test JWT_KEY
    process.env.JWT_KEY = 'wFBD=+22Fppy.T35';

    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

// hook function to be called before each test
beforeEach(async () => {
    // for each new test, reset the NATS mock for different tests
    jest.clearAllMocks();

    // clear the collection to perform new tests
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// hook function to be called after each test
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getCookie = () => {
    // can use postman to sign up a fake user and get overall structure of cookie and the encoded data
    
    // build a JWT payload { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(), // some fake id
        email: 'test@test.com'
    };

    // create JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!); // this is already defined in the beforeAll method

    // build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with encoded data
    // when returning cookies using supertest, must be in an array
    return [`session=${base64}`];
};