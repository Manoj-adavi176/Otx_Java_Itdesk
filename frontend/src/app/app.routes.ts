
import { Routes } from '@angular/router';

import { CreateTicket } from './create-ticket/create-ticket';
import { TicketList } from './ticket-list/ticket-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tickets',
    pathMatch: 'full'
  },
  {
    path: 'tickets/new',
    component: CreateTicket
  },
  {
    path: 'tickets/:id',
    component: TicketList
  },
  {
    path: 'tickets',
    component: TicketList
  },
  {
    path: '**',
    redirectTo: 'tickets'
  }
];
