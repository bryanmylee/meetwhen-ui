import type Interval from "@/models/Interval";

export default interface User {
  eventUrl: string;
  username: string;
  password: string;
  schedule: Interval[];
}
