
export interface IAuth {
    user_pass: string;
    uuid: string;
    id: string;
}

export interface IUserLoginBody {
    user_email: string;
    user_pass: string;
    uuid: string;
  }