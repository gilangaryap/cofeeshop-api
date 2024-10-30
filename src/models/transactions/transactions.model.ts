import { IBasicResponse, IBasicResponse1 } from "../response";

export interface ITransactionBody {
  user_id: number;
  payments_id: number;
  shipping_id: number;
  status_id: number;
  subtotal: number;
  tax: number;
  total_discount: number;
  grand_total: number;
}

export interface IDataTransaction extends ITransactionBody {
  id: string;
  created_date: string;
  updated_at?: string;
}

export interface IDataDetailHistory {
  full_name: string;
  phone_number: string;
  address: string;
  payment_method: string;
  shipping_method: string;
  status: string;
  grand_total: number;
}

export interface IDataProductDetailHistory {
  id: string;
  img_product: string;
  product_name: string;
  product_price: number;
  discount_price: number;
  product_size: string;
  option: string;
  shipping_method: string;
}

export interface ITransactionQuery {
  page: string;
  limit: string;
  [key: string]: any;
  status: string;
}

interface Detail {
  info: IDataDetailHistory;
  product: IDataProductDetailHistory[];
}

export interface IHistoryDetailResponse extends IBasicResponse1 {
  data?: Detail[];
}

export interface ITransactionResponse extends IBasicResponse {
  data?: IDataTransaction[];
}

export interface ITransactionProduct {
  sizes_id: number;
  products_id: number;
  transactions_id: string;
  promo_id: number;
  subtotal: number;
}
export interface ITransactionProduct extends ITransaction_product {
  id: number;
  transaction_id: number;
}

export interface ITransaction_product {
  transaction_id: number;
  product_id: number;
  size_id: number;
  ice_hot?: string;
}

export interface ITransactionQuery {
  uuid: string;
  page: string;
  limit: string;
}

interface ITransaction_Product {
  transaction_id: number;
  product_id: number;
  size_id: number;
}

export interface ITransactionWithDetailsBody extends ITransaction_product , ITransactionBody {
  products: ITransaction_Product[];
}
