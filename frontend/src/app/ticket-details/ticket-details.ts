
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

  saving = false;
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
    }
  }

  saveChanges(): void {
    if (this.saving) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const { status, resolutionNote } =
      this.updateForm.getRawValue();

    if (status === 'RESOLVED' && !resolutionNote.trim()) {
      this.errorMessage =
        'Resolution note is required when resolving a ticket.';
      return;
    }

    this.saving = true;

    this.ticketService.updateTicket(this.ticket.id, {
      status,
      resolutionNote: resolutionNote.trim() || null
    }).subscribe({
      next: () => {
        this.saving = false;
        this.errorMessage = '';
        this.successMessage =
          'Ticket updated successfully.';

        this.saved.emit();
      },

      error: (error) => {
        this.saving = false;

        console.error('Ticket update failed:', error);

        if (error.status === 400) {
          this.errorMessage =
            'Invalid update. Check the status and resolution note.';
        } else if (error.status === 404) {
          this.errorMessage =
            'Ticket not found in the database.';
        } else {
          this.errorMessage =
            'Unable to update ticket. Please try again.';
        }
      }
    });
  }

  closeModal(): void {
    if (!this.saving) {
      this.closed.emit();
    }
  }
}
