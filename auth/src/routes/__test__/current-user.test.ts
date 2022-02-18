import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    // global function defined in setup.ts
    const cookie = await global.getCookie();

    const response = await request(app)
        .get('/api/users/currentuser')
        // can set a cookie header in our response
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});