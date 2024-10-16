import { IBasicResponse, IBasicResponse1 } from "../response";

export interface IProductBody {
  product_name?: string;
  product_price?: string;
  discount_price?: string;
  product_description?: string;
  category_id?: string;
  categorie_name?: string;
  product_stock?: string;
}

export interface IProductImage {
  id: string;
  product_id: string;
  img_product: string;
}

export interface IImgProduct {
  img_1?: string;
  img_2?: string;
  img_3?: string;
}

export interface IDataProduct extends IProductBody {
  id?: string;
  uuid?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IProductModel {
  id: string;
}

interface FetchDetail {
  product: IDataProduct;
  images: IImgProduct;
}


export interface IProductQuery extends IProductPaginationQuery {
  searchText: string;
  category: string;
  minimumPrice: number;
  maximumPrice: number;
  sortBy?: string;
  favorite?: boolean;
}

export interface IProductPaginationQuery {
  page?: string;
  limit?: string;
  [key: string]: any;
}

export interface IProductResponse extends IBasicResponse1 {
  data?: IDataProduct[];
}

export interface IProductWithImageProductResponse extends IBasicResponse {
  data?: [IDataProduct[], IDataProduct[]];
}

export interface ICreateDataResponse extends IBasicResponse1 {
  data?: (IDataProduct | IProductImage)[];
}

export interface IFetchDetailResponse extends IBasicResponse1 {
  data?: FetchDetail[];
}

export interface IUpdateImageResponse extends IBasicResponse1 {
  data?: IProductImage[];
}

export interface IUpdateDataResponse extends IBasicResponse1 {
  data?: IDataProduct[];
}