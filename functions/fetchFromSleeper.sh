#!/bin/bash

# Set project ID
PROJECT_ID="fantasy-tv-guide"
LEAGUE_ID="1108780053288165376"
WEEK=1

# Create JSON payload
json_payload='{"leagueId": "'$LEAGUE_ID'", "week": '$WEEK'}'

# Base64 encode the JSON payload
base64_payload=$(echo -n "$json_payload" | base64)

# Send the request to the Pub/Sub emulator
curl -X POST "http://localhost:8085/v1/projects/$PROJECT_ID/topics/fetchSleeperData:publish" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "data": "'"$base64_payload"'"
      }
    ]
  }'

echo "Published message to local emulator for League ID: $LEAGUE_ID, Week: $WEEK"