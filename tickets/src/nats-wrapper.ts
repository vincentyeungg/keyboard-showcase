import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    // don't want to initialize stan client right away until we call connect
    private _client?: Stan;

    // use typescript getter to throw error if client is undefined. it defines the 'client' property on the instance, and is not a function
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        // make sure url is inside an object from nats docs
        this._client = nats.connect(clusterId, clientId, { url });

        // return promise to use async/await syntax
        return new Promise<void>((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('connected to NATS');
                resolve();
            });

            this._client!.on('error', (err) => {
                reject(err);
            });
        });
    }
}

// export only one single instance to be shared across application
export const natsWrapper = new NatsWrapper();