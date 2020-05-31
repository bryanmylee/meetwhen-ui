import dayjs from 'dayjs';

export async function createNewEvent(
    title, description, username, password, eventIntervals) {
  const body = ({
    username,
    password,
    title,
    description,
    eventIntervals
  });
  return (await fetch('http://localhost:5000/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })).json();
}

/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 */

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
export async function getEvent(context, eventUrl) {
  try {
    const event = await (await context
        .fetch(`http://localhost:5000/${eventUrl}`, {
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