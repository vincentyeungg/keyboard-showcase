import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

// after connected to NATS, it emits a 'connect' event -> listen for this event to know when connected
stan.on('connect', async () => {
    console.log('publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    // need to return a promise in publish method to use await/async
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        });   
    } catch (error) {
        console.log(error);
    }

    // must only send raw data or strings (JSON) to NATS
    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // stan.publish('ticket:created', data, () => {
    //     console.log('event published');
    // });
});