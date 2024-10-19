import db from "../../configs/pg";
import { IPromoBody } from "../../models/products/promo.model";

export const createData = (body: IPromoBody , product_id: string) => {
    const query = `insert into promo (discount_price , promo_name , promo_description, product_id)
      values ($1 , $2 , $3 , $4)
      returning *`
      const { discount_price, promo_name, promo_description } = body;
      const values = [discount_price, promo_name, promo_description, product_id];
    return db.query(query, values);
};

export const getAllData = () => {
  const query = `select (SELECT img_product FROM image_product WHERE product_id = p2.id LIMIT 1) AS img_product,  p.promo_name , p.promo_description  , p2.uuid  from promo p  inner  join products p2 on p.product_id = p2.id`
  return db.query(query)
}