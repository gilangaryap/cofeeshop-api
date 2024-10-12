
export interface IAuth {
    user_pass: string;
    uuid: string;
    id: string;
    role:string;
}

export interface IUserLoginBody {
    user_email: string;
    user_pass: string;
    uuid: string;
  }