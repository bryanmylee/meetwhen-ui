import type Interval from "@/models/Interval";
import type TaggedDay from "@/models/TaggedDay";

export default interface UserTaggedDay extends TaggedDay {
  dayUsers: Record<string, Interval[]>;
}
