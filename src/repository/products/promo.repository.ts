import db from "../../configs/pg";
import { IPromoBody } from "../../models/products/promo.model";

export const createData = (body: IPromoBody,imgUrl: string) => {
    const query = `insert into promo (discount_price,promo_name , promo_description,promo_img, product_id)
      values ($1 , $2 , $3 , $4 , $5)
      returning *`;
    const { discount_price , promo_name , promo_description, product_id } = body;
    const imgUrlValue = imgUrl ? `/imgs/${imgUrl}` : null;
    const values = [discount_price ,promo_name , promo_description,imgUrlValue, product_id];
    return db.query(query, values);
};