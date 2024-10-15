import { Pool, PoolClient, QueryResult } from "pg";
import {
  IDataProduct,
  IProductBody,
  IProductQuery,
} from "../../models/products/product.model";
import db from "../../configs/pg";

export const createData = ( body: IProductBody): Promise<QueryResult<IDataProduct>> => {
  const query = `insert into products ( product_name , product_price , product_description , category_id , product_stock)
    values ($1, $2, $3, $4, $5)
    returning id ,  product_name , product_price , product_description , category_id , product_stock , created_at `;
  const { product_name, product_price, product_description, category_id, product_stock} = body;
  const values = [ product_name, product_price, product_description, category_id, product_stock];
  console.log("ini: ",values)
  return db.query(query, values);
};

export const createDataImage = ( dbPool: Pool | PoolClient, id: string, imgUrl?: string): Promise<QueryResult<IDataProduct>> => {
  let query = `insert into image_product ( img_product , product_id)
      values `;
  const values: (string | null)[] = [];
  const imgUrlValue = imgUrl ? `${imgUrl}` : null;
  query += ` ($${values.length + 1}, $${values.length + 2})`;
  values.push(imgUrlValue, id);
  query += ` returning * `;
  console.log(query, values)
  return dbPool.query(query, values);
};

export const getAllData = async (
  queryParams: IProductQuery
): Promise<QueryResult<IDataProduct>> => {
  let query = ` 
      select products.uuid, products.product_name, products.product_price, products.product_description, p2.discount_price, c.categorie_name,
         (SELECT img_product FROM image_product WHERE product_id = products.id LIMIT 1) AS img_product
      FROM products
          inner join categories c on products.category_id = c.id 
          LEFT JOIN promo p2 ON products.id = p2.product_id
      `;
  let value = [];

  let whereAdd = false;

  const {
    category,
    maximumPrice,
    minimumPrice,
    searchText,
    promo,
    sortBy,
    page,
    limit,
  } = queryParams;

  if (promo) {
    query += ` inner join promo on products.id = promo.product_id `;
  }

  if (minimumPrice && maximumPrice) {
    if (maximumPrice > minimumPrice) {
      query += whereAdd ? ` where ` : ` where `;
      query += ` product_price between $${value?.length + 1} and $${
        value?.length + 2
      }`;

      value.push(minimumPrice);
      value.push(maximumPrice);
      whereAdd = true;
    }
  }

  if (searchText?.length > 0) {
    query += whereAdd ? ` and ` : ` where `;
    query += ` product_name ILIKE $${value?.length + 1} `;
    value.push(`%${searchText}%`);
    whereAdd = true;
  }

  if (category) {
    query += whereAdd ? ` AND ` : ` WHERE `;
    let categoryFilter = "";
    if (category.toLowerCase() === "specialty coffees") {
      categoryFilter = ` categorie_name = 'Specialty Coffees' `;
    } else if (category.toLowerCase() === "gourmet snacks") {
      categoryFilter = ` categorie_name = 'Gourmet Snacks'`;
    } else if (category.toLowerCase() === "sweet indulgences") {
      categoryFilter = ` categorie_name = 'Sweet Indulgences'`;
    } else if (category.toLowerCase() === "unique beverages") {
      categoryFilter = ` categorie_name = 'Unique Beverages'`;
    } else {
      throw new Error("Category invalid options");
    }

    query += categoryFilter;

    whereAdd = true;
  }

  if (sortBy) {
    let orderByClause = "";
    if (sortBy.toLowerCase() === "cheaped") {
      orderByClause = ` ORDER BY product_price ASC`;
    } else if (sortBy.toLowerCase() === "priciest") {
      orderByClause = ` ORDER BY product_price DESC`;
    } else if (sortBy.toLowerCase() === "a-z") {
      orderByClause = ` ORDER BY product_name ASC`;
    } else if (sortBy.toLowerCase() === "z-a") {
      orderByClause = ` ORDER BY product_name DESC`;
    } else if (sortBy.toLowerCase() === "latest") {
      orderByClause = ` ORDER BY created_at ASC`;
    } else if (sortBy.toLowerCase() === "longest") {
      orderByClause = ` ORDER BY created_at DESC`;
    } else {
      throw new Error("Sort invalid options");
    }
    query += orderByClause;
  } else {
    query += " ORDER BY products.category_id ASC";
  }

  if (page && limit) {
    const pageLimit = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageLimit;
    query += ` limit $${value.length + 1} offset $${value.length + 2}`;
    value.push(pageLimit, offset);
  }
  return db.query(query, value);
};

export const getDetailData = async ( uuid: string): Promise<QueryResult<IDataProduct>> => {
  let query = `select p.uuid , p.id , p.product_name ,  p.product_price ,  p2.discount_price ,  p.product_description,  p.product_stock, c.categorie_name , p.created_at,  p.updated_at
        from products p 
        inner join categories c on p.category_id = c.id 
        LEFT JOIN promo p2 ON p.id = p2.product_id
        where p.uuid = $1 `;
  return db.query(query, [uuid]);
};
export const getDetailProductImg = async (
  uuid: string
): Promise<QueryResult<IDataProduct>> => {
  let query = `SELECT  p.uuid, (SELECT img_product FROM image_product WHERE product_id = p.id LIMIT 1) AS img_product, p.product_name, p.product_price, p2.discount_price
  FROM 
    products p
INNER JOIN 
    categories c ON p.category_id = c.id
LEFT JOIN 
    promo p2 ON p.id = p2.product_id
WHERE 
    p.uuid = $1 `;
  return db.query(query, [uuid]);
};

export const getImgData = async (
  dbPool: Pool | PoolClient,
  id: string
): Promise<QueryResult<{ img_product: string }>> => {
  let query = `SELECT
  MAX(CASE WHEN rn = 1 THEN img_product ELSE NULL END) AS img_1,
  MAX(CASE WHEN rn = 2 THEN img_product ELSE NULL END) AS img_2,
  MAX(CASE WHEN rn = 3 THEN img_product ELSE NULL END) AS img_3
FROM (
  SELECT
    img_product,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY img_product) AS rn
  FROM image_product
  WHERE product_id = $1
) AS subquery;`;
  return dbPool.query(query, [id]);
};

export const getTotalData = (): Promise<
  QueryResult<{ total_product: string }>
> => {
  let query = "select count(*) as total_product from products";
  return db.query(query);
};

export const updateData = (
  id: string,
  body: IProductBody,
  imgUrl?: string
): Promise<QueryResult<IDataProduct>> => {
  let query = ` `;
  let values = [];
  let hasUpdates = false;

  const {
    product_name,
    product_price,
    product_description,
    category_id,
    product_stock,
  } = body;

  if (product_name && product_name.length > 0) {
    query += `product_name = $${values.length + 1}, `;
    values.push(product_name);
    hasUpdates = true;
  }

  if (product_price && product_price ) {
    query += `product_price = $${values.length + 1}, `;
    values.push(product_price);
    hasUpdates = true;
  }

  if (product_description && product_description.length > 0) {
    query += `product_description = $${values.length + 1}, `;
    values.push(product_description);
    hasUpdates = true;
  }

  if (category_id && category_id ) {
    query += `category_id = $${values.length + 1}, `;
    values.push(category_id);
    hasUpdates = true;
  }

  if (product_stock !== undefined) {
    query += `product_stock = $${values.length + 1}, `;
    values.push(product_stock);
    hasUpdates = true;
  }

  if (hasUpdates) {
    query = `UPDATE products SET ${query.slice(
      0,
      -2
    )}, updated_at = now() WHERE uuid = $${values.length + 1} RETURNING 
        uuid , product_name , product_price , product_description , category_id , product_stock , updated_at  ;`;
    values.push(id);
  } else {
    query = "";
  }

  if (imgUrl) {
    query += ` UPDATE image_product SET img_product = $${
      values.length + 1
    } WHERE product_id = $${values.length + 2} RETURNING img_product `;
    values.push(imgUrl ? `${imgUrl}` : null);
  }

  return db.query(query, values);
};
