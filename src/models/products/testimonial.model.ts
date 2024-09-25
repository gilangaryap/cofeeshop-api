import { IBasicResponse } from "../response";

export interface IDataTestimonial {
  full_name: string;
  comment: string;
  rating: string;
  user_img: string;
  role: string;
}

export interface IDataTestimonialBody {
    user_id: string;
    comment: string;
    rating: string;
}

export interface ITestimonialResponse extends IBasicResponse{
    data?: IDataTestimonial[]
  }
