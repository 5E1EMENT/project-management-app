export interface IUser {
  name?: string;
  login: string;
  password: string;
}

export interface IToken {
  token: string;
}

export interface ISignup {
  id: string;
  login: string;
  name: string;
}
