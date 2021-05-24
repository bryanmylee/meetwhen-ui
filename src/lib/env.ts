/*
 * IMPORTANT!!!
 * Do not import $lib/env in any client-side file as this will expose env to the client.
 * This includes:
 * - Svelte components
 * - Files imported by Svelte components e.g. $lib/api.ts
 */
export const env = {
  apiGraphQLEndpoint: import.meta.env.VITE_API_GQL_ENDPOINT as string,
};

const validateEnv = (e: typeof env) => {
  const undefinedKeys = Object.entries(e)
    .filter(([, value]) => [undefined, ''].includes(value))
    .map(([key]) => key);

  if (undefinedKeys.length > 0) {
    const message =
      '.env missing the following properties:\n' +
      undefinedKeys.map((key) => '- ' + key).join('\n');
    throw new Error(message);
  }

  const fgGreen = '\x1b[32m';
  const fgReset = '\x1b[0m';
  console.log(`${fgGreen}.env configured${fgReset}`);
};

validateEnv(env);
