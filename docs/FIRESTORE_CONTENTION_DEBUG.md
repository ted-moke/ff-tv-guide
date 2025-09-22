# Firestore Contention Debugging Guide

## Problem Description

You're experiencing Firestore transaction contention errors in production that don't occur in the local emulator:

```
Error: 10 ABORTED: Too much contention on these documents. Please try again.
details: 'Aborted due to cross-transaction contention. This occurs when multiple transactions attempt to access the same data, requiring Firestore to abort at least one in order to enforce serializability.'
```

## Root Causes

1. **Parallel Processing**: Multiple leagues being processed simultaneously
2. **Large Batches**: Processing all teams for a league in a single batch
3. **Shared Documents**: Multiple operations trying to update the same team documents
4. **No Retry Logic**: Operations failing immediately on contention

## Solutions Implemented

### 1. Retry Logic with Exponential Backoff
- Added retry logic for batch operations (3 attempts max)
- Exponential backoff with jitter to reduce collision probability
- Specific handling for contention errors (code 10)

### 2. Sequential Processing
- Changed from parallel (`Promise.all`) to sequential processing of leagues
- Reduces concurrent access to shared documents
- Better error isolation (one league failure doesn't affect others)

### 3. Smaller Batch Sizes
- Reduced batch size from all teams to 10 teams per batch
- Processes teams in smaller chunks to reduce contention window
- More granular error handling

### 4. Detailed Logging
- Added comprehensive logging for batch operations
- Tracks which leagues and batches are causing issues
- Structured logging for better debugging

### 5. Contention Monitoring
- Created `ContentionMonitor` class to track contention events
- Stores contention events in Firestore for analysis
- Provides statistics on contention patterns

## Debugging Tools

### 1. Contention Statistics Endpoint
```bash
GET /debug/contention-stats
```
Returns:
- Total contention events
- Events by league
- Events by operation
- Recent events

### 2. Clear Contention Events
```bash
DELETE /debug/contention-events
```
Clears in-memory contention events.

### 3. Enhanced Logging
Look for these log patterns:
```
Processing 12 teams for league League Name in 2 batches of 10
Processing batch 1/2 for league League Name (10 teams)
Committing batch 1/2 for league League Name
Successfully committed batch 1/2 for league League Name
```

Contention events are logged as:
```
FIRESTORE_CONTENTION {"timestamp":"...","leagueName":"...","operation":"batch_commit","errorCode":10,"retryCount":1}
```

## Monitoring in Production

### 1. Cloud Logging
Search for these patterns in Google Cloud Logging:
```
"FIRESTORE_CONTENTION"
"Batch contention for league"
"Failed to commit batch"
```

### 2. Firestore Collection
Check the `contentionEvents` collection in Firestore for detailed contention data.

### 3. Error Patterns
Monitor for:
- High retry counts
- Specific leagues causing issues
- Time patterns of contention

## Best Practices

### 1. Batch Size Optimization
- Start with batch size of 10
- Monitor contention events
- Reduce further if needed (5, 3, 1)

### 2. Timing Optimization
- Add delays between league processing
- Consider processing during off-peak hours
- Implement rate limiting

### 3. Document Design
- Avoid updating the same documents concurrently
- Use document IDs that don't conflict
- Consider sharding strategies

## Troubleshooting Steps

### 1. Immediate Actions
1. Check contention stats: `GET /debug/contention-stats`
2. Look for patterns in the logs
3. Identify problematic leagues

### 2. Short-term Fixes
1. Reduce batch size further
2. Add longer delays between operations
3. Process fewer leagues simultaneously

### 3. Long-term Solutions
1. Implement document-level locking
2. Redesign data structure to reduce conflicts
3. Use Firestore transactions more strategically

## Configuration Options

### Batch Size
```typescript
const BATCH_SIZE = 10; // Adjust based on contention
```

### Retry Settings
```typescript
const maxRetries = 3; // Number of retry attempts
const baseDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
```

### Processing Delays
```typescript
await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minute between batches
```

## Expected Improvements

After implementing these changes, you should see:
- Reduced contention errors
- Better error recovery
- Detailed visibility into contention patterns
- More reliable batch operations

## Monitoring Commands

```bash
# Check contention stats
curl https://your-api.com/debug/contention-stats

# Clear contention events
curl -X DELETE https://your-api.com/debug/contention-events
```

## Next Steps

1. Deploy the changes
2. Monitor contention stats endpoint
3. Adjust batch sizes based on real data
4. Consider implementing document-level locking if issues persist
