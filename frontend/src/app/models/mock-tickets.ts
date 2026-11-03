
import { Ticket } from './ticket.model';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'Laptop not starting',
    description: 'Laptop does not power on.',
    category: 'HARDWARE',
    priority: 'HIGH',
    requesterName: 'Alex',
    requesterEmail: 'alex@example.com',
    status: 'OPEN',
    resolutionNote: null,
    createdAt: '2026-10-28T10:00:00',
    updatedAt: '2026-10-28T10:00:00'
  },
  {
    id: 2,
    title: 'VPN connection issue',
    description: 'Unable to connect to office VPN.',
    category: 'NETWORK',
    priority: 'MEDIUM',
    requesterName: 'Sam',
    requesterEmail: 'sam@example.com',
    status: 'IN_PROGRESS',
    resolutionNote: null,
    createdAt: '2026-10-29T09:30:00',
    updatedAt: '2026-10-29T11:00:00'
  },
  {
    id: 3,
    title: 'Software installation',
    description: 'Need help installing an application.',
    category: 'SOFTWARE',
    priority: 'LOW',
    requesterName: 'Jordan',
    requesterEmail: 'jordan@example.com',
    status: 'RESOLVED',
    resolutionNote: 'Application installed successfully.',
    createdAt: '2026-10-29T14:00:00',
    updatedAt: '2026-10-30T09:00:00'
  }
];
