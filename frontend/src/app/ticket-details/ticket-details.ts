
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Ticket, TicketStatus } from '../models/ticket.model';
import { TicketService } from '../core/services/ticket';

@Component({
  selector: 'app-ticket-details',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss'
})
export class TicketDetails implements OnChanges {

  @Input({ required: true }) ticket!: Ticket;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly ticketService = inject(TicketService);

  errorMessage = '';
  successMessage = '';

  updateForm = new FormGroup({
    status: new FormControl<TicketStatus>('OPEN', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    resolutionNote: new FormControl('', {
      nonNullable: true
    })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] && this.ticket) {
      this.updateForm.setValue({
        status: this.ticket.status,
        resolutionNote: this.ticket.resolutionNote ?? ''
      });

      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  saveChanges(): void {
    const { status, resolutionNote } =
      this.updateForm.getRawValue();

    if (status === 'RESOLVED' && !resolutionNote.trim()) {
      this.errorMessage =
        'Resolution note is required when resolving a ticket.';
      this.successMessage = '';
      return;
    }

    try {
      this.ticketService.updateTicket(this.ticket.id, {
        status,
        resolutionNote: resolutionNote.trim() || null
      });

      this.errorMessage = '';
      this.successMessage = 'Ticket updated successfully.';

      this.saved.emit();
    } catch (error) {
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to update ticket.';
    }
  }

  closeModal(): void {
    this.closed.emit();
  }
}
