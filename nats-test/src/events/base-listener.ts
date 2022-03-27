import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

// base interface for any event
interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    // client is the stan client object once it is connected
    private client: Stan;
    // set to protected so that the subclass can define it if it wants to
    protected ackWait = 5 * 1000; // 5 seconds

    // constructor takes in a NATS client that is already connected successfully to the NATS server
    constructor(client: Stan) {
        this.client = client;
    }

    // to set different options, we can use NATS method of chaining different method calls
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        // create a subscription to listen to a specific channel
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        // listen for 'message' event from subscription to specific channel
        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
}