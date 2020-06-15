import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 * @typedef {{start: string, end: string}} serializedInterval
 */

/**
 * Serializes an interval to be represented as a tuple of UTC ISO strings.
 * @param {interval} interval The interval to serialize.
 * @returns {serializedInterval} The serialized interval.
 */
function serializeInterval(interval) {
  const toReturn = ({
    start: interval.start.utc().toISOString(),
    end: interval.end.utc().toISOString(),
  });
  return toReturn;
}

/**
 * Deserializes an interval to be represented as a tuple of dayjs objects.
 * @param {serializedInterval} serializedInterval The serialized interval to
 * deserialize.
 * @returns {interval} The deserialized interval.
 */
function deserializeInterval(serializedInterval) {
  return ({
    start: dayjs(serializedInterval.start),
    end: dayjs(serializedInterval.end),
  });
}

/**
 * Create a new event with the given details.
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API.
 * @param {{
 *   title: string,
 *   description: string,
 *   username: string,
 *   password: string,
 *   eventIntervals: interval[],
 * }} eventDetails The details of the event.
 * @returns {Promise<{
 *   eventUrl: string,
 *   accessToken: string,
 *   accessTokenLifetime: string,
 * }>} The access token response.
 */
export async function createNewEvent(fetch, apiUrl, eventDetails) {
  const { eventIntervals } = eventDetails;
  eventDetails.eventIntervals = eventIntervals.map(serializeInterval);
  return await (await fetch(`${apiUrl}/new`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventDetails),
  })).json();
}

/**
 * Get the details of an event.
 * @param {Function} fetch The fetch function to use.
 * @param {string} eventUrl The url identifier of the event.
 * @returns {Promise<{
 *   id: number,
 *   eventUrl: string,
 *   title: string,
 *   description: string,
 *   dateCreated: dayjs.Dayjs,
 *   eventIntervals: interval[],
 *   userIntervalsByUsername: Object.<string, interval[]>,
 * }>} The event details.
 */
export async function getEvent(fetch, apiUrl, eventUrl) {
  try {
    const event = await (await fetch(`${apiUrl}/${eventUrl}`, {
      credentials: 'include',
    })).json();

    // Parse datetimes
    event.dateCreated = dayjs(event.dateCreated);
    event.eventIntervals = event.eventIntervals.map(deserializeInterval);
    event.userIntervalsByUsername = Object.fromEntries(
        // .entries returns an array of tuples in [key, value] form.
        Object.entries(event.userIntervalsByUsername)
            .map(([username, intervals]) => [
              username,
              intervals.map(deserializeInterval),
            ]));
    return event;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Add a user with the given details to an event.
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API.
 * @param {string} eventUrl The URL of the event.
 * @param {{
 *   username: string,
 *   password: string,
 *   intervals: interval[],
 * }} userDetails The details of the user joining the event.
 * @returns {Promise<{
 *   eventUrl: string,
 *   accessToken: string,
 *   accessTokenLifetime: string,
 * }>} The access token after logging in as the registered user.
 * @throws An error if the username is already taken.
 */
export async function addUserToEvent(fetch, apiUrl, eventUrl, userDetails) {
  try {
    userDetails.intervals = userDetails.intervals.map(serializeInterval);
    const response = await (await fetch(`${apiUrl}/${eventUrl}/new_user`, {
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
 *
 * @param {Function} fetch The fetch function to use.
 * @param {string} apiUrl The URL of the API.
 * @param {string} eventUrl The URL of the event.
 * @param {{
 *   username: string,
 *   intervals: interval[],
 *   accessToken: string,
 * }} userDetails The details of the user being edited.
 * @throws An error if the access token is not set, or is invalid.
 */
export async function editUserIntervals(fetch, apiUrl, eventUrl, userDetails) {
  try {
    const { username, accessToken } = userDetails;
    const intervals = userDetails.intervals.map(serializeInterval);
    const response = await (await fetch(
        `${apiUrl}/${eventUrl}/${username}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({intervals}),
    })).json();
    if (response.error) {
      throw new Error(response.error);
    }
  } catch (err) {
    throw err;
  }
}