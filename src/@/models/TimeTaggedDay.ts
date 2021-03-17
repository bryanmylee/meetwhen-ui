import type { Dayjs } from "dayjs";
import type TaggedDay from "@/models/TaggedDay";

export default interface TimeTaggedDay extends TaggedDay {
  dayTimes: Dayjs[];
}
