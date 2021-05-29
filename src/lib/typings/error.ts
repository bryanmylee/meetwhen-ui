interface APIException {
  details: {
    id: 'auth/wrong-password' | 'auth/user-not-found' | 'auth/missing-email';
  };
}

export interface APIError {
  extensions: {
    exception: APIException;
  };
}
