import mongoose from 'mongoose';

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// TicketDoc is the interface that will be shown in mongoDB for each document, we can add additional properties like 'createdAt' and others
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    // additional function call for type checking on ticket attributes before creation
    build(attrs: TicketAttrs): TicketDoc;
}

// types specific to mongoose
const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    // use id instead of _id
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id,
            delete ret._id
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };