#!/bin/bash

# Set project ID
PROJECT_ID="fantasy-tv-guide"
LEAGUE_ID="1108780053288165376"
WEEK=17
LOCATION="us-east1"

# Create the Cloud Scheduler job
gcloud scheduler jobs create pubsub fetch-sleeper-data-job \
    --location=$LOCATION \
    --schedule="0 * * * *" \
    --topic=fetchSleeperData \
    --message-body='{"leagueId": "'$LEAGUE_ID'", "week": '$WEEK'}' \
    --time-zone="America/Los_Angeles" \
    --project=$PROJECT_ID

echo "Created hourly scheduler job for League ID: $LEAGUE_ID, Week: $WEEK"