
import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  TicketStatus,
  TicketPriority
} from '../models/ticket.model';

import { TicketService } from '../core/services/ticket';
import { TicketDetails } from '../ticket-details/ticket-details';

@Component({
  selector: 'app-ticket-list',
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    TicketDetails
  ],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.scss'
})
export class TicketList {

  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tickets = this.ticketService.tickets;

  searchText = signal('');
  selectedStatus = signal<TicketStatus | 'ALL'>('ALL');
  selectedPriority = signal<TicketPriority | 'ALL'>('ALL');

  readonly selectedTicketId = signal<number | null>(null);
  readonly invalidTicketId = signal(false);

  readonly selectedTicket = computed(() => {
    const id = this.selectedTicketId();

    return id === null
      ? undefined
      : this.ticketService.getTicketById(id);
  });

  readonly filteredTickets = computed(() => {
    const search = this.searchText().trim().toLowerCase();

    return this.tickets().filter(ticket => {
      const matchesSearch =
        search === '' ||
        ticket.title.toLowerCase().includes(search) ||
        ticket.id.toString().includes(search);

      const matchesStatus =
        this.selectedStatus() === 'ALL' ||
        ticket.status === this.selectedStatus();

      const matchesPriority =
        this.selectedPriority() === 'ALL' ||
        ticket.priority === this.selectedPriority();

      return matchesSearch &&
        matchesStatus &&
        matchesPriority;
    });
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam === null) {
        this.selectedTicketId.set(null);
        this.invalidTicketId.set(false);
        return;
      }

      const id = Number(idParam);

      if (!Number.isSafeInteger(id) || id <= 0) {
        this.selectedTicketId.set(null);
        this.invalidTicketId.set(true);
        return;
      }

      this.selectedTicketId.set(id);
      this.invalidTicketId.set(false);
    });
  }

  openTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  closeTicket(): void {
    this.router.navigate(['/tickets']);
  }

  onTicketSaved(): void {
    // TicketService updates the shared signal automatically.
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedStatus.set('ALL');
    this.selectedPriority.set('ALL');
  }
}
