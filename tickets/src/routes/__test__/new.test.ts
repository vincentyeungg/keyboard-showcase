import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    // need to send an authenticated request
    const cookie = global.getCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    // empty string title
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    // no title parameter
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            price: 10
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    // invalid price
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: 'test_title',
            price: -10
        })
        .expect(400);

    // no price parameter
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: 'test_title'
        })
        .expect(400);
});

it('creates a ticket with valid inputs', async () => {

});