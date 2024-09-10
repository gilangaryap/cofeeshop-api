import { IBasicResponse } from "./response";

export interface IUsersParams {
  uuid: string;
}

export interface IUserRegister {
    hashedPassword: string;
    email: string
}

export interface IUsersQuery {
  page: string;
  limit: string;
  [key: string]: any;
}

export interface IUserRegisterBody extends IUserBody {
  user_pass: string;
}

export interface IUserLoginBody {
  user_email: string;
  user_pass: string;
  uuid: string;
}

export interface IUserBody {
  user_email: string;
}

export interface IDataUser extends IUserBody {
  id: string;
  uuid: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface IUserResponse extends IBasicResponse {
  data?: IDataUser[];
}

/* export interface IauthResponse extends IBasicResponse {
  data?: {
    token: string;
    uuid: string;
    id:string;
  }[];
} */

