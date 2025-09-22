import { getDb } from "../firebase";

interface ContentionEvent {
  timestamp: Date;
  leagueId: string;
  leagueName: string;
  operation: string;
  errorCode: number;
  errorMessage: string;
  retryCount: number;
  batchSize: number;
}

export class ContentionMonitor {
  private static instance: ContentionMonitor;
  private contentionEvents: ContentionEvent[] = [];
  private readonly MAX_EVENTS = 1000; // Keep last 1000 events in memory

  private constructor() {}

  public static getInstance(): ContentionMonitor {
    if (!ContentionMonitor.instance) {
      ContentionMonitor.instance = new ContentionMonitor();
    }
    return ContentionMonitor.instance;
  }

  public logContentionEvent(event: Omit<ContentionEvent, 'timestamp'>): void {
    const contentionEvent: ContentionEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.contentionEvents.push(contentionEvent);

    // Keep only the most recent events
    if (this.contentionEvents.length > this.MAX_EVENTS) {
      this.contentionEvents = this.contentionEvents.slice(-this.MAX_EVENTS);
    }

    // Log to console with structured format
    console.error('FIRESTORE_CONTENTION', JSON.stringify({
      timestamp: contentionEvent.timestamp.toISOString(),
      leagueId: contentionEvent.leagueId,
      leagueName: contentionEvent.leagueName,
      operation: contentionEvent.operation,
      errorCode: contentionEvent.errorCode,
      errorMessage: contentionEvent.errorMessage,
      retryCount: contentionEvent.retryCount,
      batchSize: contentionEvent.batchSize,
    }));

    // Store in Firestore for analysis
    this.storeContentionEvent(contentionEvent);
  }

  private async storeContentionEvent(event: ContentionEvent): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('contentionEvents').add(event);
    } catch (error) {
      console.error('Failed to store contention event:', error);
    }
  }

  public getContentionStats(): {
    totalEvents: number;
    eventsByLeague: Record<string, number>;
    eventsByOperation: Record<string, number>;
    recentEvents: ContentionEvent[];
  } {
    const eventsByLeague: Record<string, number> = {};
    const eventsByOperation: Record<string, number> = {};

    this.contentionEvents.forEach(event => {
      eventsByLeague[event.leagueName] = (eventsByLeague[event.leagueName] || 0) + 1;
      eventsByOperation[event.operation] = (eventsByOperation[event.operation] || 0) + 1;
    });

    return {
      totalEvents: this.contentionEvents.length,
      eventsByLeague,
      eventsByOperation,
      recentEvents: this.contentionEvents.slice(-10), // Last 10 events
    };
  }

  public async getContentionStatsFromFirestore(): Promise<{
    totalEvents: number;
    eventsByLeague: Record<string, number>;
    eventsByOperation: Record<string, number>;
    recentEvents: ContentionEvent[];
  }> {
    try {
      const db = await getDb();
      const snapshot = await db.collection('contentionEvents')
        .orderBy('timestamp', 'desc')
        .limit(1000)
        .get();

      const events: ContentionEvent[] = [];
      const eventsByLeague: Record<string, number> = {};
      const eventsByOperation: Record<string, number> = {};

      snapshot.docs.forEach(doc => {
        const event = doc.data() as ContentionEvent;
        events.push(event);
        eventsByLeague[event.leagueName] = (eventsByLeague[event.leagueName] || 0) + 1;
        eventsByOperation[event.operation] = (eventsByOperation[event.operation] || 0) + 1;
      });

      return {
        totalEvents: events.length,
        eventsByLeague,
        eventsByOperation,
        recentEvents: events.slice(0, 10),
      };
    } catch (error) {
      console.error('Failed to get contention stats from Firestore:', error);
      return this.getContentionStats();
    }
  }

  public clearEvents(): void {
    this.contentionEvents = [];
  }
}
