import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

// after connected to NATS, it emits a 'connect' event -> listen for this event to know when connected
stan.on('connect', () => {
    console.log('publisher connected to NATS');

    // must only send raw data or strings (JSON) to NATS
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log('event published');
    });
});