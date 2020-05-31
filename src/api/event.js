import dayjs from 'dayjs';

/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 */

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
    event.eventIntervals = event.eventIntervals.map((interval) => ({
      start: dayjs(interval.start),
      end: dayjs(interval.end),
    }));
    event.userIntervalsByUsername = Object.fromEntries(
        // .entries returns an array of tuples in [key, value] form.
        Object.entries(event.userIntervalsByUsername)
            .map(([username, intervals]) => [
              username,
              intervals.map((interval) => ({
                start: dayjs(interval.start),
                end: dayjs(interval.end),
              }))
            ]));
    return event;
  } catch (err) {
    console.log(err);
  }
}