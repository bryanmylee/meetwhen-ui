/**
 * Log a user into an event.
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API endpoint.
 * @param {string} eventUrl The URL identifier of the event.
 * @param {{
 *   username: string
 *   password: string
 * }} userDetails The user details.
 * @returns {{
 *   eventUrl: string,
 *   accessToken: string,
 *   accessTokenLifetime: string,
 * }} The access token response.
 * @throws An error if the event does not exist, user does not exist, or
 * password is incorrect.
 */
export async function login(fetch, apiUrl, eventUrl, userDetails) {
  try {
    const response = await (await fetch(`${apiUrl}/${eventUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })).json();

    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  } catch (err) {
    throw err;
  }
}

/**
 * Log a user out of an event.
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API endpoint.
 * @param {string} eventUrl The URL identifier of the event.
 * @returns {{
 *   message: string,
 * }} The logout response.
 * @throws An error if the logout fails.
 */
export async function logout(fetch, apiUrl, eventUrl) {
  try {
    const response = await (await fetch(`${apiUrl}/${eventUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })).json();

    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch an access token from the API if an HTTP-only refresh token exists.
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API endpoint.
 * @param {string} eventUrl The URL identifier of the event.
 * @returns {{
 *   eventUrl: string,
 *   accessToken: string,
 *   accessTokenLifetime: string,
 * }} The access token response.
 * @throws An error if the refresh token does not exist.
 */
export async function getAccessToken(fetch, apiUrl, eventUrl) {
  try {
    const response = await (await fetch(`${apiUrl}/${eventUrl}/refresh_token`, {
      method: 'POST',
      credentials: 'include', // Include the protected cookie
      headers: {
        'Content-Type': 'application/json',
      },
    })).json();

    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  } catch (err) {
    throw err;
  }
}