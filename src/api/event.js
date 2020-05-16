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
  const response = await (await fetch('http://localhost:5000/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })).json();
  console.log(body);
  console.log(response);
}

export async function getEvent(context, eventUrl) {
  try {
    /*
     * event: {
     *   id: number,
     *   eventUrl: string,
     *   title: string,
     *   description: string,
     *   dateCreated: string,
     *   eventIntervals: {start: string, end: string}[],
     *   userIntervalsByUsername: {
     *     [username: string]: {start: string, end: string}[],
     *   },
     * }
     */
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
    return { event };
  } catch (err) {
    console.log(err);
  }
}