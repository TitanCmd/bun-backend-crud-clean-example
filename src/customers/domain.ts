//Domain model: pure types/entities, no HTTP/persistence.

export interface Customer {
  id: string;
  name: string;
  email: string;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
