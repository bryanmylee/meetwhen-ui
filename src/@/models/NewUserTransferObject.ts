import { fromInterval } from "@/models/IntervalTransferObject";
import type IntervalTransferObject from "@/models/IntervalTransferObject";
import type User from "@/models/User";

export default interface NewUserTransferObject {
  username: string;
  password: string;
  schedule: IntervalTransferObject[];
}

export const fromUser = ({
  username,
  password,
  schedule = [],
}: User): NewUserTransferObject => ({
  username,
  password,
  schedule: schedule.map(fromInterval),
});
