# Cache Management Guide

## Problem
After deploying new backend and frontend code, users were seeing 304 Not Modified responses and old data due to aggressive browser and CDN caching.

## Solution Implemented

### 1. Backend Cache Control Headers
- Added middleware in `backend/src/index.ts` to set cache control headers on all responses:
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - `Pragma: no-cache`
  - `Expires: 0`

### 2. Cache-Busting Timestamps
- Added timestamps to all API responses in controllers:
  - `userTeamController.ts`
  - `platformController.ts`
  - `externalLeagueController.ts`
  - `cacheController.ts`

### 3. Frontend Cache-Busting Query Parameters
- Added `_t=${Date.now()}` query parameter to API calls:
  - User teams API
  - Opponent teams API
  - Platforms API
  - External leagues API
  - Leagues paginated API

### 4. Deployment Version Tracking
- Created `deploymentInfo.ts` utility to track deployment timestamps
- Added deployment info to health endpoint
- Created deployment script with version generation

### 5. Cache Management Endpoints
- `/cache/info` - Get cache information and deployment details
- `/cache/clear` - Trigger cache clearing (for client-side use)

## Deployment Best Practices

### 1. Use the Deployment Script
```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Run the deployment script
./scripts/deploy.sh
```

### 2. Set Environment Variables
Make sure your deployment process sets the `DEPLOYMENT_VERSION` environment variable:
```bash
export DEPLOYMENT_VERSION=$(date +%Y%m%d_%H%M%S)
```

### 3. Clear Client-Side Cache
After deployment, users may need to:
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Use the `/cache/clear` endpoint to trigger cache invalidation

## Testing Cache Busting

### 1. Check Health Endpoint
```bash
curl https://your-api.com/health
```
Should return deployment information with timestamps.

### 2. Check Cache Info
```bash
curl https://your-api.com/cache/info
```
Should return cache configuration and deployment details.

### 3. Verify API Responses
All API responses should now include:
- Cache control headers
- Timestamps in the response body
- Cache-busting query parameters in frontend requests

## Monitoring

### 1. Check Response Headers
Ensure all API responses include the cache control headers:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### 2. Monitor 304 Responses
After deployment, monitor for 304 Not Modified responses. These should be significantly reduced.

### 3. Check Deployment Timestamps
Verify that deployment timestamps are updating correctly in the health endpoint.

## Troubleshooting

### If users still see old data:
1. Check that cache control headers are being set
2. Verify frontend is using cache-busting query parameters
3. Ensure deployment version is being set correctly
4. Ask users to hard refresh their browsers
5. Check CDN settings if using a CDN

### If API responses are slow:
1. Consider implementing conditional caching for static data
2. Use ETags for conditional requests
3. Implement proper cache warming strategies

## Future Improvements

1. **Conditional Caching**: Implement ETags for better cache control
2. **Cache Warming**: Pre-populate cache with frequently accessed data
3. **CDN Configuration**: Optimize CDN settings for API responses
4. **Service Worker**: Implement service worker for better cache management
5. **Cache Invalidation**: Implement automatic cache invalidation strategies
