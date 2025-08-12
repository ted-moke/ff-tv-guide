import { Timestamp } from 'firebase-admin/firestore';
import type { Team as SharedTeam, Player as SharedPlayer } from '../types/shared';

// Extend the shared Team interface to include Firestore-specific types
export interface Team extends Omit<SharedTeam, 'lastFetched'> {
  lastFetched: Timestamp | Date;
}

export type { SharedPlayer as Player };
