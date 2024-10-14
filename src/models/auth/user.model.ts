import { IBasicResponse, IBasicResponse1 } from "../response";

export interface IUsersParams {
  id: string;
}

export interface IUserRegister {
  hashedPassword: string;
  email: string;
}

export interface IUsersQuery {
  page: string;
  limit: string;
  [key: string]: any;
}

export interface IUserRegisterBody extends IUserBody {
  user_pass: string;
}

export interface IUserProfileData {
  id: string;
  profile_image: string;
  full_name: string;
  phone_number: string;
  address: string;
  user_email: string;
}

export interface IUserBody {
  user_email: string;
}

export interface IDataUser extends IUserBody {
  id: string;
}

export interface IUserResponse extends IBasicResponse {
  data?: IDataUser[];
}

export interface IRegisterResponse extends IBasicResponse1 {
  data?: IDataUser[];
}

export interface IUserProfileResponse extends IBasicResponse1{
  data?: IUserProfileData[]
}