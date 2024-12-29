#!/bin/bash

# Replace YOUR_PROJECT_ID with your actual Firebase project ID
PROJECT_ID="fantasy-tv-guide"

# JSON payload with the leagueId
json_payload='{"leagueId": "1108780053288165376"}'  # Replace with the actual league ID

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