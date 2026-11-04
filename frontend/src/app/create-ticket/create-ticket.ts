import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TicketService, CreateTicketRequest } from '../core/services/ticket';
import { TicketCategory, TicketPriority } from '../models/ticket.model';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss'
})
export class CreateTicket {

  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);

  ticketForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    priority: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    requesterName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    requesterEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  submitted = false;
  saving = false;
  errorMessage = '';

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    if (this.saving) {
      return;
    }

    const formValue = this.ticketForm.getRawValue();

    const request: CreateTicketRequest = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      category: formValue.category as TicketCategory,
      priority: formValue.priority as TicketPriority,
      requesterName: formValue.requesterName.trim(),
      requesterEmail: formValue.requesterEmail.trim()
    };

    this.saving = true;

    this.ticketService.createTicket(request).subscribe({
      next: (createdTicket) => {
        this.saving = false;

        this.router.navigate([
          '/tickets',
          createdTicket.id
        ]);
      },

      error: (error) => {
        console.error('Ticket creation failed:', error);

        this.saving = false;

        this.errorMessage =
          error.status === 400
            ? 'Invalid ticket information. Please check the form.'
            : 'Unable to create ticket. Please try again.';
      }
    });
  }
}