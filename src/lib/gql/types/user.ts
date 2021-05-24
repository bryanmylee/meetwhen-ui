import type { Identifiable } from './identifiable';
import type { Meeting } from './meeting';
import type { Schedule } from './schedule';

export interface User extends Identifiable {
  name: string;
  email: string;
  meetings: Meeting[];
  schedules: Schedule[];
}
