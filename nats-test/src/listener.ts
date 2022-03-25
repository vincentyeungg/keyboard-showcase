import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        // end this process, don't do anything else
        process.exit();
    });

    // to set different options, we can use NATS method of chaining different method calls
    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true);

    // create a subscription to listen to a specific channel
    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options);

    // listen for 'message' event from subscription to specific channel
    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }

        // manually acknowledge if using manual ack mode
        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());