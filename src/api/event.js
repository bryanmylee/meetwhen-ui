export async function createNewEvent(
    title, description, username, password, eventIntervals) {
  const body = ({
    username,
    password,
    title,
    description,
    eventIntervals
  });
  const response = await (await fetch('https://localhost:5000/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })).json();
  console.log(body);
  console.log(response);
}