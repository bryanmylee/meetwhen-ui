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
  return ({
    start: interval.start.utc().toISOString(),
    end: interval.end.utc().toISOString(),
  });
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
 * 
 * @param {string} apiUrl The URL of the API.
 * @param {{
 *   title: string,
 *   description: string,
 *   username: string,
 *   password: string,
 *   eventIntervals: interval[],
 * }} eventDetails The details of the event.
 */
export async function createNewEvent(apiUrl, eventDetails) {
  const { eventIntervals } = eventDetails;
  eventDetails.eventIntervals = eventIntervals.map(serializeInterval);
  return await (await fetch(`${apiUrl}/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventDetails),
  })).json();
}

/**
 * Get the details of an event.
 * @param {*} fetch The fetch function to use.
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
 * 
 * @param {string} apiUrl The URL of the API.
 * @param {string} eventUrl The URL of the event.
 * @param {{
 *   username: string,
 *   password: string,
 *   intervals: interval[],
 * }} userDetails The details of the user joining the event.
 */
export async function addUserToEvent(apiUrl, eventUrl, userDetails) {
  try {
    const { intervals } = userDetails;
    userDetails.intervals = intervals.map(serializeInterval);
    const response = await 
        (await fetch(`${apiUrl}/${eventUrl}/new_user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetails),
        })).json();
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}