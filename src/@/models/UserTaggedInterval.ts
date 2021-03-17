import type Interval from "@/models/Interval";

export default interface UserTaggedInterval extends Interval {
  users: string[];
}
