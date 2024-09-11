const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

async function accessSecretVersion(projectId: string, secretId: string, versionId: number) {
  const client = new SecretManagerServiceClient();

  const [secret] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretId}/versions/${versionId}`,
  });

  return secret.payload.data.toString();
}

export async function getSecret(secretName: string, secretVersion = 1) {
  try {
    const secretValue = await accessSecretVersion(
      process.env.GCP_PROJECT_ID || "",
      secretName,
      secretVersion,
    );

    return secretValue;
  } catch (error) {
    console.error(error);
  }
}
