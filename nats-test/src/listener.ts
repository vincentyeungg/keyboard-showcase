import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('listener connected to NATS');

    // create a subscription to listen to a specific channel
    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group');

    // listen for 'message' event from subscription to specific channel
    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
    });
});