// Utility to track deployment information for cache busting
export const DEPLOYMENT_TIMESTAMP = Date.now();
export const DEPLOYMENT_VERSION = process.env.DEPLOYMENT_VERSION || '1.0.0';

export const getDeploymentInfo = () => ({
  timestamp: DEPLOYMENT_TIMESTAMP,
  version: DEPLOYMENT_VERSION,
  deployedAt: new Date(DEPLOYMENT_TIMESTAMP).toISOString()
});
