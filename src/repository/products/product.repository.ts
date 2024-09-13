import { Pool, PoolClient, QueryResult } from "pg";
import { IDataproduct, IProductBody } from "../../models/products/product.model";
import db from "../../configs/pg";

export const createData = (body: IProductBody): Promise<QueryResult<IDataproduct>> => {
    const query = `insert into products ( product_name , product_price , product_description , category_id , product_stock)
      values ($1, $2, $3, $4, $5)
      returning product_name , product_price , product_description , category_id , product_stock , created_at `;
    const { product_name , product_price , product_description , category_id , product_stock} = body;
    const values = [ product_name , product_price , product_description , category_id , product_stock];
    console.log("ini dari clg: ",product_name , product_price , product_description , category_id , product_stock)
    return db.query(query, values);
  };
  
export const createDataImage = (dbPool: Pool | PoolClient,id: string,imgUrl?: string): Promise<QueryResult<IDataproduct>> => {
    let query = `insert into image_product ( img_product , product_id)
      values `;
    const values: (string | null)[] = [];
    const imgUrlValue = imgUrl ? `${imgUrl}` : null;
    query += ` ($${values.length + 1}, $${values.length + 2})`;
    values.push(imgUrlValue, id);
    query += ` returning * `;
    return dbPool.query(query, values);
};