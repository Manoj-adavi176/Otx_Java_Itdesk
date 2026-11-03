
export type TicketCategory =
  'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'ACCESS';

export type TicketPriority =
  'LOW' | 'MEDIUM' | 'HIGH';

export type TicketStatus =
  'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  requesterName: string;
  requesterEmail: string;
  status: TicketStatus;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}
