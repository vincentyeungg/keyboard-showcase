export abstract class CustomError extends Error {
    // this class is used to follow a general structure of errors that may occur in development
    abstract statusCode: number;

    constructor(message: string) {
        // for logging purposes during debug
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string }[];
}