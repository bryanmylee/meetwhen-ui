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
 * @param {*} context The `this` context of `@sapper.preload`.
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
export async function getEvent(context, apiUrl, eventUrl) {
  try {
    const event = await (await context
        .fetch(`${apiUrl}/${eventUrl}`, {
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