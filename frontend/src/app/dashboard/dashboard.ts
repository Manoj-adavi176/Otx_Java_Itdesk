import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ticket } from '../models/ticket.model';
import { MOCK_TICKETS } from '../models/mock-tickets';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  tickets: Ticket[] = MOCK_TICKETS;

  totalTickets = this.tickets.length;

  openTickets = this.tickets.filter(
    ticket => ticket.status === 'OPEN'
  ).length;

  inProgressTickets = this.tickets.filter(
    ticket => ticket.status === 'IN_PROGRESS'
  ).length;

  resolvedTickets = this.tickets.filter(
    ticket => ticket.status === 'RESOLVED'
  ).length;

  recentTickets = [...this.tickets]
    .sort((a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
}
