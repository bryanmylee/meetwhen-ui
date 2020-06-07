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