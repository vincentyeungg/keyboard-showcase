import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];

    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']): Promise<void> {
        // to achieve async style publish event
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                // if there is an error, just return early and reject
                if (err) {
                    return reject(err);
                }
                // no errors, can resolve and return promise
                console.log('Event published to subject', this.subject);
                resolve();
            });
        });
    }
}