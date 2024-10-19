import { IBasicResponse1 } from '../response';

export interface IProfileBody {
  full_name: string;
  phone_number: string;
  address: string;
  profile_image?: string;
}

export interface IDetailData extends IProfileBody {
  user_email: string;
  created_at: string;
  update_at:string;
}

export interface IDataProfile extends IProfileBody {
  user_id?: string;
}

export interface IDataProfileResponse extends IBasicResponse1{
    data?: IProfileBody[]
}

export interface IDataUpdateProfileResponse extends IBasicResponse1{
  data?: IDataProfile[]
}

export interface IDetailDataResponse extends IBasicResponse1{
    data?: IDetailData[]
}