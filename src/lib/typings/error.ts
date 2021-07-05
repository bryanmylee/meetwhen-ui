type IDs =
  | 'auth/wrong-password'
  | 'auth/invalid-password'
  | 'auth/user-not-found'
  | 'auth/missing-email'
  | 'auth/email-already-exists'
  | 'auth/invalid-email'
  | 'auth/too-many-requests'
  | 'already-exists';

export interface APIError {
  message: string;
  extensions: {
    exception: {
      details: {
        id: IDs;
      };
    };
  };
}
