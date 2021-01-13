export default interface Response {
  error?: string;
}

export interface AuthResponse extends Response {
  eventUrl: string;
  accessToken: string;
  accessTokenLifetime: string;
}

