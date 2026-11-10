import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CreateTicketRequest,
  TicketService
} from '../core/services/ticket';

import {
  UnsavedChangesAware
} from '../core/guards/unsaved-changes.guard';

import {
  TicketCategory,
  TicketPriority
} from '../models/ticket.model';

function nonBlank(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim()
    ? null
    : { required: true };
}

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss'
})
export class CreateTicket implements UnsavedChangesAware {
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly ticketForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(255)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(2000)]
    }),
    category: new FormControl<TicketCategory | ''>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    priority: new FormControl<TicketPriority | ''>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    requesterName: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(255)]
    }),
    requesterEmail: new FormControl('', {
      nonNullable: true,
      validators: [
        nonBlank,
        Validators.email,
        Validators.maxLength(255)
      ]
    })
  });

  fieldError(name: string): string {
    const control = this.ticketForm.get(name);

    if (!control || !control.touched || !control.invalid) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required and cannot contain only spaces.';
    }

    if (control.hasError('maxlength')) {
      const maximum = control.getError('maxlength').requiredLength;
      return `Use at most ${maximum} characters.`;
    }

    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }

    return 'Enter a valid value.';
  }

  onSubmit(): void {
    if (this.saving()) {
      return;
    }

    this.errorMessage.set('');

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const value = this.ticketForm.getRawValue();

    if (value.category === '' || value.priority === '') {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const request: CreateTicketRequest = {
      title: value.title.trim(),
      description: value.description.trim(),
      category: value.category,
      priority: value.priority,
      requesterName: value.requesterName.trim(),
      requesterEmail: value.requesterEmail.trim()
    };

    this.saving.set(true);
    this.ticketForm.disable();

    this.ticketService.createTicket(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: createdTicket => {
        this.ticketForm.enable();
        this.ticketForm.markAsPristine();
        this.saving.set(false);

        this.router.navigate(['/tickets', createdTicket.id]);
      },
      error: error => {
        console.error('Ticket creation failed:', error);

        this.ticketForm.enable();
        this.saving.set(false);

        this.errorMessage.set(
          error.status === 400
            ? 'Invalid ticket information. Please check the form.'
            : 'Unable to create ticket. Please try again.'
        );
      }
    });
  }

  canDeactivate(): boolean {
    if (this.saving()) {
      return false;
    }

    return !this.ticketForm.dirty ||
      window.confirm('Discard your unfinished ticket?');
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.ticketForm.dirty || this.saving()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}