import type User from '@my/models/User';

export default interface Auth {
  user: Pick<User, 'eventUrl' | 'username'>;
  accessToken: string;
}

