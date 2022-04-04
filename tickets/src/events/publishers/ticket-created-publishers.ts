import { Publisher, Subjects, TicketCreatedEvent } from '@ahjoo123_tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;   
}

