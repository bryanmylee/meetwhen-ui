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
    const event = await (await context.fetch(`http://localhost:5000/${eventUrl}`, {
      credentials: 'include',
    })).json();
    return { event };
  } catch (err) {
    console.log(err);
  }
}