import { query } from '$lib/gql';
import type { ShallowMeeting } from './types';

const GET_MY_MEETINGS = `
{
  me {
    meetings {
      id
      slug
      name
    }
    schedules {
      meeting {
        id
        name
        slug
      }
    }
  }
}`;

interface MyMeetingsResolved {
  me: {
    meetings: ShallowMeeting[];
    schedules: {
      meeting: ShallowMeeting[];
    };
  };
}

interface MyMeetingsReturned {
  owned: ShallowMeeting[];
  joined: ShallowMeeting[];
}

export const getMyMeetings = async (accessToken?: string): Promise<MyMeetingsReturned> => {
  const { me } = (await query({
    query: GET_MY_MEETINGS,
    headers: {
      cookie: `access-token=${accessToken}`,
    },
  })) as MyMeetingsResolved;
  return {
    owned: me.meetings ?? [],
    joined: me.schedules.meeting ?? [],
  };
};
