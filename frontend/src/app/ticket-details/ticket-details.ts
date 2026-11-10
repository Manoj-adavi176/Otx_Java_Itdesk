import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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

  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly updateForm = new FormGroup({
    status: new FormControl<TicketStatus>('OPEN', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    resolutionNote: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(2000)]
    })
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] && this.ticket) {
      this.updateForm.reset({
        status: this.ticket.status,
        resolutionNote: this.ticket.resolutionNote ?? ''
      });

      this.errorMessage.set('');
    }
  }

  saveChanges(): void {
    if (this.saving()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.errorMessage.set(
        'Select a status and keep the resolution note within 2000 characters.'
      );
      return;
    }

    const value = this.updateForm.getRawValue();
    const note = value.resolutionNote.trim();

    if (value.status === 'RESOLVED' && !note) {
      this.errorMessage.set(
        'Resolution note is required when resolving a ticket.'
      );
      return;
    }

    this.saving.set(true);
    this.updateForm.disable();

    this.ticketService.updateTicket(this.ticket.id, {
      status: value.status,
      // Send an empty string to intentionally clear an existing note.
      resolutionNote: note
    }).subscribe({
      next: () => {
        this.updateForm.enable();
        this.saving.set(false);
        this.errorMessage.set('');
        this.successMessage.set('Ticket updated successfully.');
        this.saved.emit();
      },
      error: error => {
        console.error('Ticket update failed:', error);

        this.updateForm.enable();
        this.saving.set(false);

        if (error.status === 400) {
          this.errorMessage.set(
            'Invalid update. Check the status and resolution note.'
          );
        } else if (error.status === 404) {
          this.errorMessage.set('Ticket not found in the database.');
        } else {
          this.errorMessage.set(
            'Unable to update ticket. Please try again.'
          );
        }
      }
    });
  }

  closeModal(): void {
    if (!this.saving()) {
      this.closed.emit();
    }
  }
}