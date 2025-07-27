#!/bin/bash

# Authenticate with Google Cloud
gcloud auth login

# Set your Google Cloud project
PROJECT_ID="fantasy-tv-guide"
LEAGUE_ID="1108780053288165376"
WEEK=17

# Compose message
MESSAGE='{"leagueId": "'$LEAGUE_ID'", "week": '$WEEK'}'

# Publish a message to the Pub/Sub topic
gcloud pubsub topics publish fetchSleeperData \
  --project="$PROJECT_ID" \
  --message "$MESSAGE"

echo "Published message to fetch data for League ID: $LEAGUE_ID, Week: $WEEK"