import { IBasicResponse, IBasicResponse1 } from "../response";

export interface IProductBody {
    product_name?: string;
    product_price?: string;
    discount_price?: string;
    product_description?: string;
    category_id?: string;
    product_stock?: string;
}

export interface IProductImage {
    id:string;
    product_id:string;
    img_product:string;
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

export interface ICreateSuccessResponse extends IBasicResponse1 {
    data?: (IDataProduct | IProductImage)[];
}

