
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Ticket } from '../../models/ticket.model';

export type CreateTicketRequest = Pick<
  Ticket,
  | 'title'
  | 'description'
  | 'category'
  | 'priority'
  | 'requesterName'
  | 'requesterEmail'
>;

export type UpdateTicketRequest = {
  status: Ticket['status'];
  resolutionNote: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/tickets';

  private readonly ticketsState = signal<Ticket[]>([]);

  readonly tickets = this.ticketsState.asReadonly();

  // GET /api/tickets
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl).pipe(
      tap(tickets => this.ticketsState.set(tickets))
    );
  }

  // Read an already-loaded ticket from Angular state
  getTicketById(id: number): Ticket | undefined {
    return this.ticketsState().find(
      ticket => ticket.id === id
    );
  }

  // GET /api/tickets/{id}
  fetchTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(
      `${this.apiUrl}/${id}`
    ).pipe(
      tap(ticket => this.upsertTicket(ticket))
    );
  }

  // POST /api/tickets
  createTicket(
    request: CreateTicketRequest
  ): Observable<Ticket> {
    return this.http.post<Ticket>(
      this.apiUrl,
      request
    ).pipe(
      tap(ticket => this.upsertTicket(ticket))
    );
  }

  // PUT /api/tickets/{id}
  updateTicket(
    id: number,
    request: UpdateTicketRequest
  ): Observable<Ticket> {
    return this.http.put<Ticket>(
      `${this.apiUrl}/${id}`,
      request
    ).pipe(
      tap(ticket => this.upsertTicket(ticket))
    );
  }

  private upsertTicket(ticket: Ticket): void {
    this.ticketsState.update(tickets => {
      const exists = tickets.some(
        current => current.id === ticket.id
      );

      if (exists) {
        return tickets.map(current =>
          current.id === ticket.id ? ticket : current
        );
      }

      return [...tickets, ticket];
    });
  }
}
