
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss'
})
export class CreateTicket {

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

  onSubmit(): void {
    this.submitted = true;

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    console.log('Valid ticket form:', this.ticketForm.getRawValue());
  }
}
