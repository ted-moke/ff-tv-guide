#!/bin/bash

# Authenticate with Google Cloud
gcloud auth login

# Set your Google Cloud project
PROJECT_ID="fantasy-tv-guide"  # Replace with your actual project ID
LEAGUE_ID="1049490994725167104"
WEEK=1

# make message out here
# use variable for leagueId and week
# compose message based on PROJECT_ID and WEEK
MESSAGE='{"leagueId": "'$LEAGUE_ID'", "week": '$WEEK'}'
# Publish a message to the Pub/Sub topic
gcloud pubsub topics publish fetchSleeperData --project="$PROJECT_ID" --message "$MESSAGE"  # Replace with actual league ID and week