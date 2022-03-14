import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.getCookie())
        .send({
            title,
            price
        });
};

it('can fetch a list of tickeets', async () => {
    await createTicket('title_1', 20);
    await createTicket('title_3', 30);
    await createTicket('title_5', 40);
    
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});