export type IsoDateString = string;

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  api_key: string;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: 'bearer';
  api_key: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  balance: number;
  is_admin: boolean;
  created_at: IsoDateString;
};
