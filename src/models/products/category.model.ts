import { IBasicResponse } from "../../models/response";

export interface ICategoriesBody {
    category_name: string,
}

export interface IDataCategories extends ICategoriesBody {
    id: number,
    Ischeck:boolean,
    created_at: string,
    updated_at?: string
}

export interface ICategoriesResponse extends IBasicResponse {
    data?: IDataCategories[],
}
