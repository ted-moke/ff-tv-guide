#!/bin/bash

# Deployment script with cache busting
# This script sets a deployment version to help prevent caching issues

# Generate a deployment version based on timestamp
DEPLOYMENT_VERSION=$(date +%Y%m%d_%H%M%S)

echo "Deploying with version: $DEPLOYMENT_VERSION"

# Set the deployment version as an environment variable
export DEPLOYMENT_VERSION=$DEPLOYMENT_VERSION

# Add the deployment version to your deployment command
# For example, if using Firebase:
# firebase deploy --only functions,hosting

# Or if using other deployment methods, make sure to pass the DEPLOYMENT_VERSION
# environment variable to your deployment process

echo "Deployment version $DEPLOYMENT_VERSION has been set"
echo "Make sure your deployment process uses this environment variable"
