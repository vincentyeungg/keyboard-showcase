import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.getCookie())
        .send({
            title: 'test_title',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test_title',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    // make sure to use 2 separate ids to genarate 2 cookies for 2 separate users

    // response below contains ticket created by user of particular id
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title: 'test_title',
            price: 20
        });

    // trying to retrieve created ticket using a separate cookie (not the same user as the creator)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.getCookie())
        .send({
            title: 'new_title',
            price: 3000
        })
        .expect(401);
});

it('returns a 400 if a user provides an invalid title or price', async () => {
    // save same copy of cookie to identity as the same user
    const cookie = global.getCookie();

    // response below contains ticket created by user of particular id
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test_title',
            price: 20
        });

    // invalid title
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    // invalid price
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new_test_ticket',
            price: -10
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    // save same copy of cookie to identity as the same user
    const cookie = global.getCookie();

    // response below contains ticket created by user of particular id
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test_title',
            price: 20
        });

    // try to edit the ticket
    const new_title = 'new_title';
    const new_price = 100;

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: new_title,
            price: new_price
        })
        .expect(200);

    // verify the ticket has been updated
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual(new_title);
    expect(ticketResponse.body.price).toEqual(new_price);
});