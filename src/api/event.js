import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 * @typedef {{start: number, end: number}} serializedInterval
 */

/**
 * Serializes an interval to be represented as a tuple of Unix timestamps in ms.
 * @param {interval} interval The interval to serialize.
 * @returns {serializedInterval} The serialized interval.
 */
function serializeInterval(interval) {
  const toReturn = ({
    start: +interval.start,
    end: +interval.end,
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
 *   schedule: interval[],
 * }} eventDetails The details of the event.
 * @returns {Promise<{
 *   eventUrl: string,
 *   accessToken: string,
 * }>} The access token response.
 */
export async function createNewEvent(fetch, apiUrl, eventDetails) {
  const { title, description, username, password, schedule } = eventDetails;
  const scheduleInMs = schedule.map(serializeInterval);
  return await (await fetch(`${apiUrl}/new`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      username,
      password,
      scheduleInMs
    }),
  })).json();
}

/**
 * Get the details of an event.
 * @param {Function} fetch The fetch function to use.
 * @param {string} eventUrl The url identifier of the event.
 * @returns {Promise<{
 *   eventUrl: string,
 *   title: string,
 *   description: string,
 *   admin: string,
 *   schedule: interval[],
 *   userSchedules: Object.<string, interval[]>,
 * }>} The event details.
 */
export async function getEvent(fetch, apiUrl, eventUrl) {
  try {
    const {
      title, description, admin, scheduleInMs, userSchedulesInMs
    } = await (await fetch(`${apiUrl}/${eventUrl}`, {
      credentials: 'include',
    })).json();

    // Parse datetimes
    const schedule = scheduleInMs.map(deserializeInterval);
    let userSchedules = {};
    if (userSchedulesInMs) {
      userSchedules = Object.fromEntries(
          // .entries returns an array of tuples in [key, value] form.
          Object.entries(userSchedulesInMs)
              .map(([username, intervals]) => [
                username,
                intervals.map(deserializeInterval),
              ]));
    }
    return ({
      eventUrl,
      title,
      description,
      admin,
      schedule,
      userSchedules,
    });
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
 *   schedule: interval[],
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
    const { username, password, schedule } = userDetails;
    const scheduleInMs = schedule.map(serializeInterval);
    const response = await (await fetch(`${apiUrl}/${eventUrl}/new_user`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        scheduleInMs,
      }),
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
 *   newSchedule: interval[],
 *   accessToken: string,
 * }} userDetails The details of the user being edited.
 * @returns {Promise<void>} Resolved when the intervals have been updated.
 * @throws An error if the access token is not set, or is invalid.
 */
export async function editUserIntervals(fetch, apiUrl, eventUrl, userDetails) {
  try {
    const { username, accessToken } = userDetails;
    const newScheduleInMs = userDetails.newSchedule.map(serializeInterval);
    const response = await (await fetch(
        `${apiUrl}/${eventUrl}/${username}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ newScheduleInMs }),
    })).json();
    if (response.error) {
      throw new Error(response.error);
    }
  } catch (err) {
    throw err;
  }
}