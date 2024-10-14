import { IBasicResponse1 } from "../response";

export interface IAuth {
  user_pass: string;
  uuid: string;
  id: string;
  role: string;
}

export interface IUserLoginBody {
  user_email: string;
  user_pass: string;
  uuid: string;
}

export interface IAuthResponse extends IBasicResponse1 {
  data?: Array<{
      token: string;
      uuid: string;
      id: string;
      role:string;
  }>;
}
