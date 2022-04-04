import { Publisher, Subjects, TicketUpdatedEvent } from '@ahjoo123_tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;   
}