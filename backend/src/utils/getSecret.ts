const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

async function accessSecretVersion(
  projectId: string,
  secretId: string,
  versionId: number,
) {
  try {
    const client = new SecretManagerServiceClient();

    const [secret] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretId}/versions/${versionId}`,
    });

    return secret.payload.data.toString();
  } catch (error) {
    console.error(error);
  }
}

export async function getSecret(secretName: string, secretVersion = 1) {
  try {
    console.log("Getting secret", secretName, secretVersion);
    const secretValue = await accessSecretVersion(
      process.env.GCP_PROJECT_ID || "",
      secretName,
      secretVersion,
    );

    return JSON.parse(secretValue);
  } catch (error) {
    console.error(error);
  }
}
