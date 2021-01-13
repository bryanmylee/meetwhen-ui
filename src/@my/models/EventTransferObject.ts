import { fromInterval, toInterval } from '@my/models/IntervalTransferObject';
import type IntervalTransferObject from '@my/models/IntervalTransferObject';
import type Event from '@my/models/Event';

export default interface EventTransferObject {
  color: string;
  eventUrl: string;
  schedule: IntervalTransferObject[];
  title: string;
  userSchedules: Record<string, IntervalTransferObject[]>;
  accessToken?: string;
}

export const toEvent = ({
  color,
  eventUrl,
  schedule,
  title,
  userSchedules,
}: EventTransferObject): Event => ({
  color,
  eventUrl,
  name: title,
  schedule: schedule.map(toInterval),
  users: Object.fromEntries(
    Object.entries(userSchedules)
      .map(([name, schedule]) => [name, schedule.map(toInterval)])
  ),
});

export const fromEvent = ({
  color,
  eventUrl,
  name,
  schedule,
  users,
}: Partial<Event>): Partial<EventTransferObject> => ({
  color,
  eventUrl,
  schedule: schedule?.map(fromInterval),
  title: name,
  userSchedules: Object.fromEntries(
    Object.entries(users ?? {})
      .map(([name, schedule]) => [name, schedule.map(fromInterval)])
  ),
});

