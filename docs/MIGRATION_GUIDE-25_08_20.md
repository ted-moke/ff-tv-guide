# FF TV Guide - Migration Guide

This guide covers the deployment process and migration strategy for the season-to-season data structure changes in the FF TV Guide application.

## Overview

The migration introduces a new `LeagueMaster` data structure that groups leagues across seasons, enabling better multi-season support and data organization.

## What the Migration Does

### Data Structure Changes

**Before Migration:**
```typescript
League {
  name: string;
  platform: Platform;
  externalLeagueId: string;
  // ... other fields
}
```

**After Migration:**
```typescript
// New LeagueMaster to group leagues across seasons
LeagueMaster {
  name: string;
  platform: Platform;
  externalLeagueId: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

// Updated League with season and master reference
League {
  leagueMasterId: string;  // NEW - links to LeagueMaster
  season: number;          // NEW - identifies the season
  name: string;
  platform: Platform;
  externalLeagueId: string;
  // ... other fields
}

// Updated Team with season and master reference
Team {
  leagueMasterId: string;  // NEW
  season: number;          // NEW
  // ... existing fields
}

// Updated UserTeam with master reference
UserTeam {
  leagueMasterId: string;  // NEW
  currentSeason: number;   // NEW
  // ... existing fields
}
```

### Migration Process

1. **Groups leagues** by platform and external league ID
2. **Creates LeagueMaster records** for each unique league group
3. **Updates existing leagues** with `leagueMasterId` and `season` fields
4. **Updates teams** with `leagueMasterId` and `season` fields
5. **Updates userTeams** with `leagueMasterId` and `currentSeason` fields

## Deployment Process

### 1. Pre-Deployment Checklist

- [ ] **Backup Firestore data** (export via Firebase console)
- [ ] **Test migration on staging environment** with production data copy
- [ ] **Verify existing functionality** works with new data structure
- [ ] **Document current data state** (count of leagues, teams, userTeams)
- [ ] **Schedule maintenance window** for low-traffic period

### 2. Deploy New Code

Follow the standard deployment process:

```bash
# Deploy backend
cd backend
yarn install
yarn run deploy

# Deploy frontend
cd frontend
yarn install
yarn build
yarn run deploy
```

### 3. Run Migration

**Option 1: Via Admin UI (Recommended)**
1. Navigate to your admin panel
2. Use the MigrationTools component
3. Enter the season (e.g., 2025)
4. Click "Run Migration"

**Option 2: Via API Endpoint**
```bash
curl -X POST "https://your-api-url/migration/add-league-master?season=2025" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Option 3: Via Script**
```bash
cd backend
yarn ts-node scripts/runMigration.ts
```

### 4. Verify Migration Success

Check the migration response for:
- All leagues processed successfully
- LeagueMaster records created
- Teams and UserTeams updated
- No errors in the process

Expected response:
```json
{
  "success": true,
  "message": "Migration completed successfully",
  "season": 2025,
  "stats": {
    "leaguesProcessed": 150,
    "leagueMastersCreated": 45,
    "teamsUpdated": 1800,
    "userTeamsUpdated": 150,
    "errors": []
  }
}
```

### 5. Post-Deployment Verification

- [ ] **User team history** displays correctly
- [ ] **League grouping** works as expected
- [ ] **Season-based filtering** functions properly
- [ ] **No runtime errors** in application logs
- [ ] **Critical user flows** work as expected

## Risks & Breaking Data Concerns

### 🚨 High Risk Areas

1. **No Rollback Mechanism**
   - The migration doesn't include an automated rollback script
   - Once run, changes cannot be easily undone
   - Requires manual data restoration if issues occur

2. **Data Loss Potential**
   - If migration fails partway through, data could become inconsistent
   - Some records may have new fields while others don't
   - Partial updates could break application functionality

3. **Orphaned Records**
   - Teams without valid leagues become orphaned
   - UserTeams without valid teams become orphaned
   - These records may cause errors in the application

4. **Batch Operation Failures**
   - Firestore batch operations have limits (500 operations per batch)
   - Large datasets may exceed these limits
   - Network failures can cause partial updates

### ⚠️ Medium Risk Areas

1. **Season Assignment**
   - All existing leagues assigned the same season (2025)
   - Historical data may not reflect actual seasons
   - Could affect season-based filtering and history

2. **CreatedBy Field**
   - LeagueMaster records created with `createdBy: "migration"`
   - Doesn't preserve actual user who created the league
   - May affect user attribution and permissions

3. **Missing Data Validation**
   - Migration doesn't validate required fields exist
   - Could fail on malformed data
   - No pre-flight checks for data integrity

### 🟡 Low Risk Areas

1. **Read-Only Operations**
   - Migration only adds fields, doesn't delete existing data
   - Original data structure remains intact
   - Safe from accidental data deletion

2. **Idempotent Design**
   - Running migration multiple times should be safe
   - Won't create duplicate LeagueMaster records
   - Won't overwrite existing data

## Rollback Strategy

Since there's no automated rollback, follow this manual process if issues occur:

### 1. Immediate Response
1. **Stop the application** to prevent further data corruption
2. **Document the current state** and any errors encountered
3. **Assess the scope** of the issue

### 2. Data Restoration
1. **Restore from Firestore backup** (created before migration)
2. **Verify data integrity** after restoration
3. **Test application functionality** with restored data

### 3. Code Rollback
1. **Revert to previous code version**
2. **Redeploy the application**
3. **Verify everything works** with the old data structure

### 4. Post-Rollback Analysis
1. **Analyze what went wrong** during migration
2. **Fix the underlying issues**
3. **Plan a new migration attempt** with improvements

## Testing Strategy

### 1. Staging Environment Testing
- Create a copy of production data in staging
- Run migration on staging environment
- Test all functionality thoroughly
- Verify data integrity and relationships

### 2. Test Data Seeding
Use the built-in test data seeding:
```bash
# Via admin UI or API
POST /migration/seed-test-data
```

This creates test leagues, teams, and user teams for migration testing.

### 3. Validation Tests
- Verify LeagueMaster creation
- Check league-team relationships
- Test user team history functionality
- Validate season-based filtering

## Monitoring & Alerting

### 1. Migration Monitoring
- Monitor migration logs for errors
- Track migration progress and completion
- Alert on migration failures or timeouts

### 2. Post-Migration Monitoring
- Monitor application error rates
- Watch for data consistency issues
- Track user-reported problems
- Monitor performance metrics

### 3. Data Integrity Checks
- Verify all leagues have LeagueMaster references
- Check that teams have proper season assignments
- Ensure UserTeams have valid leagueMasterId values
- Validate data relationships are intact

## Best Practices

### 1. Communication
- Notify users about scheduled maintenance
- Provide clear timeline for migration
- Have support team ready for questions

### 2. Documentation
- Document the migration process
- Keep records of any issues encountered
- Update runbooks with new procedures

### 3. Testing
- Always test on staging first
- Use production-like data for testing
- Test rollback procedures

### 4. Monitoring
- Set up comprehensive monitoring
- Have alerting in place
- Monitor both technical and business metrics

## Troubleshooting

### Common Issues

1. **Migration Fails with Batch Errors**
   - Reduce batch size in migration script
   - Split large datasets into smaller chunks
   - Retry with exponential backoff

2. **Orphaned Records**
   - Check for missing league references
   - Verify team-league relationships
   - Clean up orphaned records manually

3. **Season Assignment Issues**
   - Verify season parameter is correct
   - Check for historical data accuracy
   - Consider manual season corrections

4. **Performance Issues**
   - Monitor Firestore read/write operations
   - Check for rate limiting
   - Optimize batch operations

### Getting Help

If you encounter issues during migration:

1. **Check the logs** for detailed error messages
2. **Review the migration stats** for clues about failures
3. **Test with smaller datasets** to isolate issues
4. **Consult the development team** for complex problems

## Conclusion

This migration is a significant structural change that will improve data organization and enable better multi-season support. While it carries some risks, careful planning, testing, and monitoring can ensure a successful deployment.

Remember: **Always backup your data before running the migration, and test thoroughly on staging first.**
