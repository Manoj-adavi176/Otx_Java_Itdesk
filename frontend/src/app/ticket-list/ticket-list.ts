
import {
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Subscription } from 'rxjs';

import {
  Ticket,
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
export class TicketList implements OnInit, OnDestroy {

  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly subscriptions = new Subscription();
  private ticketRequest?: Subscription;

  readonly tickets = this.ticketService.tickets;

  searchText = signal('');
  selectedStatus = signal<TicketStatus | 'ALL'>('ALL');
  selectedPriority = signal<TicketPriority | 'ALL'>('ALL');

  loading = signal(false);
  loadError = signal('');

  detailsLoading = signal(false);
  detailsError = signal('');
  detailsNotFound = signal(false);

  readonly selectedTicketId = signal<number | null>(null);
  readonly selectedTicketData = signal<Ticket | null>(null);
  readonly invalidTicketId = signal(false);

  readonly selectedTicket = computed(
    () => this.selectedTicketData()
  );

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

  ngOnInit(): void {
    this.loadTickets();

    const routeSubscription = this.route.paramMap.subscribe(
      params => {
        const idParam = params.get('id');

        this.ticketRequest?.unsubscribe();
        this.selectedTicketData.set(null);
        this.detailsError.set('');
        this.detailsNotFound.set(false);
        this.detailsLoading.set(false);

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

        this.invalidTicketId.set(false);
        this.selectedTicketId.set(id);
        this.loadTicketDetails(id);
      }
    );

    this.subscriptions.add(routeSubscription);
  }

  loadTickets(): void {
    this.loading.set(true);
    this.loadError.set('');

    const subscription = this.ticketService
      .getAllTickets()
      .subscribe({
        next: (data) => {
          console.log(data)
          this.loading.set(false);
        },
        error: error => {
          console.error('Failed to load tickets:', error);
          this.loading.set(false);
          this.loadError.set(
            'Unable to load tickets from the backend.'
          );
        }
      });

    this.subscriptions.add(subscription);
  }

  loadTicketDetails(id: number): void {
    this.detailsLoading.set(true);
    this.detailsError.set('');
    this.detailsNotFound.set(false);

    this.ticketRequest = this.ticketService
      .fetchTicketById(id)
      .subscribe({
        next: ticket => {
          this.selectedTicketData.set(ticket);
          this.detailsLoading.set(false);
        },
        error: error => {
          this.detailsLoading.set(false);
          console.error('Failed to load ticket:', error);

          if (error.status === 404) {
            this.detailsNotFound.set(true);
          } else {
            this.detailsError.set(
              'Unable to load ticket details.'
            );
          }
        }
      });
  }

  openTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  closeTicket(): void {
    this.router.navigate(['/tickets']);
  }

  onTicketSaved(): void {
    const updated = this.tickets().find(
      ticket => ticket.id === this.selectedTicketId()
    );

    if (updated) {
      this.selectedTicketData.set(updated);
    }
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedStatus.set('ALL');
    this.selectedPriority.set('ALL');
  }

  ngOnDestroy(): void {
    this.ticketRequest?.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
