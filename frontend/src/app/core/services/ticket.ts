
import { Injectable, signal } from '@angular/core';

import { Ticket } from '../../models/ticket.model';
import { MOCK_TICKETS } from '../../models/mock-tickets';

export type CreateTicketRequest = Pick<
  Ticket,
  | 'title'
  | 'description'
  | 'category'
  | 'priority'
  | 'requesterName'
  | 'requesterEmail'
>;

export type UpdateTicketRequest = Partial<
  Pick<Ticket, 'status' | 'resolutionNote'>
>;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly ticketsState = signal<Ticket[]>(
    MOCK_TICKETS.map(ticket => ({ ...ticket }))
  );

  readonly tickets = this.ticketsState.asReadonly();

  getTicketById(id: number): Ticket | undefined {
    return this.ticketsState().find(ticket => ticket.id === id);
  }

  createTicket(request: CreateTicketRequest): Ticket {
    const tickets = this.ticketsState();

    const nextId = tickets.reduce(
      (max, ticket) => Math.max(max, ticket.id),
      0
    ) + 1;

    const now = new Date().toISOString();

    const newTicket: Ticket = {
      ...request,
      id: nextId,
      status: 'OPEN',
      resolutionNote: null,
      createdAt: now,
      updatedAt: now
    };

    this.ticketsState.update(current => [
      ...current,
      newTicket
    ]);

    return newTicket;
  }

  updateTicket(
    id: number,
    request: UpdateTicketRequest
  ): Ticket {

    const existingTicket = this.getTicketById(id);

    if (!existingTicket) {
      throw new Error(`Ticket with ID ${id} not found`);
    }

    const updatedTicket: Ticket = {
      ...existingTicket,
      ...request,
      updatedAt: new Date().toISOString()
    };

    if (
      updatedTicket.status === 'RESOLVED' &&
      !updatedTicket.resolutionNote?.trim()
    ) {
      throw new Error(
        'Resolution note is required for RESOLVED tickets'
      );
    }

    this.ticketsState.update(tickets =>
      tickets.map(ticket =>
        ticket.id === id ? updatedTicket : ticket
      )
    );

    return updatedTicket;
  }
}
