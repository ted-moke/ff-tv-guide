import { getDb } from "../firebase";

export class ApiTrackingService {
  static async trackApiCall(platform: 'fleaflicker' | 'sleeper', endpoint: string) {
    const db = await getDb();
    const apiCallsRef = db.collection('apiCalls').doc(platform);

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(apiCallsRef);
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const hour = now.getHours().toString().padStart(2, '0'); // 00-23
      const minute = now.getMinutes().toString().padStart(2, '0'); // 00-59

      if (doc.exists) {
        const data = doc.data()!;
        const dailyCalls = data.dailyCalls || {};
        const hourlyCalls = data.hourlyCalls || {};
        const endpointCalls = data.endpointCalls || {};
        let { maxCallsPerMinute = 0, lastMinute = '', currentMinuteCalls = 0 } = data;

        // Update daily calls
        dailyCalls[today] = (dailyCalls[today] || 0) + 1;

        // Update hourly calls
        if (!hourlyCalls[today]) hourlyCalls[today] = {};
        hourlyCalls[today][hour] = (hourlyCalls[today][hour] || 0) + 1;

        // Update endpoint calls
        endpointCalls[endpoint] = (endpointCalls[endpoint] || 0) + 1;

        // Update max calls per minute
        const currentMinute = `${today}T${hour}:${minute}`;
        if (currentMinute === lastMinute) {
          currentMinuteCalls++;
        } else {
          currentMinuteCalls = 1;
        }
        maxCallsPerMinute = Math.max(maxCallsPerMinute, currentMinuteCalls);

        transaction.update(apiCallsRef, {
          totalCalls: data.totalCalls + 1,
          lastCalled: now,
          dailyCalls,
          hourlyCalls,
          endpointCalls,
          maxCallsPerMinute,
          lastMinute: currentMinute,
          currentMinuteCalls
        });
      } else {
        const currentMinute = `${today}T${hour}:${minute}`;
        transaction.set(apiCallsRef, {
          totalCalls: 1,
          lastCalled: now,
          dailyCalls: { [today]: 1 },
          hourlyCalls: { [today]: { [hour]: 1 } },
          endpointCalls: { [endpoint]: 1 },
          maxCallsPerMinute: 1,
          lastMinute: currentMinute,
          currentMinuteCalls: 1
        });
      }
    });
  }
}