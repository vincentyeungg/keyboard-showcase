export const natsWrapper = {
    // fake implementation
    client: {
        // use jest.fn() to keep track of things i.e., was it invoked, how any times it was invoked, etc
        publish: jest
            .fn()
            .mockImplementation(
                (subject: string, data: string, callback: () => void) => {
                    callback();
                }
            )
    }
};