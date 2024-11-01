import db from "../../configs/pg";
import { IDataPromo, IPromoBody } from "../../models/products/promo.model";
import { QueryResult } from 'pg';

export const createData = (body: IPromoBody , product_id: string): Promise<QueryResult<IDataPromo>> => {
    const query = `insert into promos (discount_price , promo_name , promo_description, product_id)
      values ($1 , $2 , $3 , $4)
      returning *`
      const { discount_price, promo_name, promo_description } = body;
      const values = [discount_price, promo_name, promo_description, product_id];
    return db.query(query, values);
};

export const getAllData = (): Promise<QueryResult<IDataPromo>> => {
  const query = `select (SELECT img_product FROM image_product WHERE product_id = p2.id LIMIT 1) AS img_product,  p.promo_name , p.promo_description  , p2.id  from promos p  inner  join products p2 on p.product_id = p2.id`
  return db.query(query)
}

export const DelateData = async (id: string): Promise<string> => {
  const query = 'delete from public.promos where product_id = $1';
  try {
    await db.query(query, [id]);
    return 'Product successfully deleted';
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to delete product: ${err.message}`);
    }
    throw new Error('An unknown error occurred while deleting the product.');
  }
};

