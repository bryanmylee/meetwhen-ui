import dayjs from 'dayjs';
import { query } from '$lib/gql';
import { IntervalSerializer, ShallowMeeting, ShallowMeetingDTO } from './types';

const GET_PROFILE_PAGE = `
query ($timeNow: Int!, $upcomingLimit: Int) {
  me {
    upcomingMeetings: allMeetings(order: EARLIEST, key: END, after: $timeNow, limit: $upcomingLimit) {
      id
      slug
      name
      total {
        beg
        end
      }
    }
  }
}`;

export interface ProfilePageVariables {
  timeNow?: number;
  upcomingLimit?: number;
}

interface ProfilePageResolved {
  me: {
    upcomingMeetings: ShallowMeetingDTO[];
  };
}

interface ProfilePageReturned {
  upcomingMeetings: ShallowMeeting[];
}

export const getProfilePage = async ({
  timeNow,
  upcomingLimit,
}: ProfilePageVariables): Promise<ProfilePageReturned> => {
  const { me } = (await query({
    query: GET_PROFILE_PAGE,
    variables: {
      upcomingLimit,
      timeNow: timeNow ?? dayjs().unix(),
    },
  })) as ProfilePageResolved;
  const upcomingMeetings = me.upcomingMeetings.map(({ total, ...meeting }) => ({
    ...meeting,
    total: IntervalSerializer.deserialize(total),
  }));
  return {
    upcomingMeetings,
  };
};
