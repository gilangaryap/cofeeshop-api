import { IBasicResponse } from "../response";

export interface IProductBody {
    product_name?: string;
    product_price?: number;
    discount_price?: number;
    product_description?: string;
    category_id?: number;
    product_stock?: number;
    img_product?:string;
}

export interface IDataProduct extends IProductBody {
    id?: string;
    created_at?: string;
    updated_at?: string;
    uuid?: string;
    total_product?: string;
}

export interface IProductModel {
    id: string,
}

export interface IProductQuery extends IProductPaginationQuery{
    searchText: string ; 
    category: string;
    minimumPrice: number;
    maximumPrice: number;
    sortBy?: string;
    promo?: boolean;
}

export interface IProductPaginationQuery{
    page?: string;
    limit?: string
    [key: string]: any;
}

export interface IProductResponse extends IBasicResponse {
    data?: IDataProduct[];
}

export interface IProductWithImageProductResponse extends IBasicResponse {
    data?: [ IDataProduct[] , IDataProduct[] ]
}
