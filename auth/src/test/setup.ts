import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongo: any;

declare global {
    var getCookie: () => Promise<string[]>;
}

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

global.getCookie = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};