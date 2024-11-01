import { Pool, PoolClient, QueryResult } from "pg";
import { IDataProduct, IImgProduct, IProductBody, IProductImage, IProductQuery,} from "../../models/products/product.model";
import db from "../../configs/pg";

export const createData = (body: IProductBody): Promise<QueryResult<IDataProduct>> => {
  const query = `insert into products ( product_name , product_price , product_description , category_id , product_stock)
    values ($1, $2, $3, $4, $5)
    returning id ,  product_name , product_price , product_description , category_id , product_stock , created_at `;
  const { product_name, product_price, product_description, category_id, product_stock,} = body;
  const values = [ product_name, product_price, product_description, category_id, product_stock,];
  return db.query(query, values);
};

export const createDataImage = ( dbPool: Pool | PoolClient, id: string, imgUrl?: string): Promise<QueryResult<IProductImage>> => {
  let query = `insert into image_product ( img_product , product_id)
      values `;
  const values: (string | null)[] = [];
  const imgUrlValue = imgUrl ? `${imgUrl}` : null;
  query += ` ($${values.length + 1}, $${values.length + 2})`;
  values.push(imgUrlValue, id);
  query += ` returning * `;
  return dbPool.query(query, values);
};

export const getAllData = async (queryParams: IProductQuery): Promise<QueryResult<IDataProduct>> => {
  let query = `
      SELECT products.id, products.product_name, products.product_price, products.product_description, products.rating, p2.discount_price, c.category_name,
         (SELECT img_product FROM image_product WHERE product_id = products.id LIMIT 1) AS img_product
      FROM products
          INNER JOIN categories c ON products.category_id = c.id 
          LEFT JOIN promos p2 ON products.id = p2.product_id
      WHERE products.isdelete = false
  `;
  let value: any[] = [];
  
  const { category, maximumPrice, minimumPrice, searchText, favorite, sortBy, page, limit} = queryParams;

  if (favorite) {
    query += `  AND rating > 4`;
  }

  if (searchText?.length > 0) {
    query += ` AND product_name ILIKE $${value.length + 1}`;
    value.push(`%${searchText}%`);
  }

  if (minimumPrice !== undefined && maximumPrice !== undefined && maximumPrice > minimumPrice) {
    query += ` AND product_price BETWEEN $${value.length + 1} AND $${value.length + 2}`;
    value.push(minimumPrice, maximumPrice);
  }

  const categoryMap: { [key: string]: string } = {
    "specialty coffees": "Specialty Coffees",
    "gourmet snacks": "Gourmet Snacks",
    "sweet indulgences": "Sweet Indulgences",
    "unique beverages": "Unique Beverages",
  };

  if (category && categoryMap[category.toLowerCase()]) {
    query += ` AND category_name = '${categoryMap[category.toLowerCase()]}'`;
  } else if (category) {
    throw new Error("Invalid category option");
  }

  if (sortBy) {
    const orderByMap: { [key: string]: string } = {
      "cheapest": "product_price ASC",
      "priciest": "product_price DESC",
      "a-z": "product_name ASC",
      "z-a": "product_name DESC",
      "latest": "created_at ASC",
      "longest": "created_at DESC",
    };
    if (orderByMap[sortBy.toLowerCase()]) {
      query += ` ORDER BY ${orderByMap[sortBy.toLowerCase()]}`;
    } else {
      throw new Error("Invalid sort option");
    }
  } else {
    query += " ORDER BY products.category_id ASC";
  }

  if (page && limit) {
    const pageLimit = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageLimit;
    query += ` LIMIT $${value.length + 1} OFFSET $${value.length + 2}`;
    value.push(pageLimit, offset);
  }
  return db.query(query, value);
};

export const getDetailData = async ( uuid: string): Promise<QueryResult<IDataProduct>> => {
  let query = `select p.uuid , p.id , p.product_name ,  p.product_price ,  p2.discount_price ,  p.product_description,  p.product_stock, c.category_name , p.created_at,  p.updated_at
        from products p 
        inner join categories c on p.category_id = c.id 
        LEFT JOIN promos p2 ON p.id = p2.product_id 
        WHERE p.uuid = $1 AND p.isdelete = false`;
  return db.query(query, [uuid]);
};

export const getDetailProductImg = async (uuid: string): Promise<QueryResult<IDataProduct>> => {
  let query = `SELECT  p.uuid, (SELECT img_product FROM image_product WHERE product_id = p.id LIMIT 1) AS img_product, p.product_name, p.product_price, p2.discount_price
  FROM 
    products p
INNER JOIN 
    categories c ON p.category_id = c.id
LEFT JOIN 
    promos p2 ON p.id = p2.product_id
WHERE 
    p.uuid = $1 `;
  return db.query(query, [uuid]);
};

export const getImgData = async ( dbPool: Pool | PoolClient, id: string): Promise<QueryResult<IImgProduct>> => {
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

export const getTotalData = (): Promise< QueryResult<{ total_product: string }>> => {
  let query = "SELECT COUNT(*) AS total_product FROM products WHERE isdelete = false";
  return db.query(query);
};

export const updateData = async (id: string, body: IProductBody): Promise<QueryResult<IDataProduct>> => {
  let queryParts: string[] = [];
  const values: any[] = [];
  let hasUpdates = false;

  const {
    product_name,
    product_price,
    product_description,
    category_id,
    product_stock,
  } = body;

  if (product_name && product_name.length > 0) {
    queryParts.push(`product_name = $${values.length + 1}`);
    values.push(product_name);
    hasUpdates = true;
  }

  if (product_price !== undefined) {
    queryParts.push(`product_price = $${values.length + 1}`);
    values.push(product_price);
    hasUpdates = true;
  }

  if (product_description && product_description.length > 0) {
    queryParts.push(`product_description = $${values.length + 1}`);
    values.push(product_description);
    hasUpdates = true;
  }

  if (category_id !== undefined) {
    queryParts.push(`category_id = $${values.length + 1}`);
    values.push(category_id);
    hasUpdates = true;
  }

  if (product_stock !== undefined) {
    queryParts.push(`product_stock = $${values.length + 1}`);
    values.push(product_stock);
    hasUpdates = true;
  }

  if (hasUpdates) {
    const query = `
      UPDATE products 
      SET ${queryParts.join(', ')}, updated_at = NOW() 
      WHERE uuid = $${values.length + 1} 
      RETURNING uuid, product_name, product_price, product_description, category_id, product_stock, updated_at;
    `;
    values.push(id);


    return await db.query(query, values); 
  } else {
    throw new Error('No fields to update');
  }
};

export const deleteImage = (id: string) => {
  const query = `DELETE FROM public.image_product WHERE product_id = $1`
  const value = [id];
  return db.query(query , value)
}

export const DelateData = async (uuid: string): Promise<string> => {
  const query = 'UPDATE products SET isdelete = true WHERE uuid = $1';
  try {
    await db.query(query, [uuid]);
    return 'Product successfully deleted';
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to delete product: ${err.message}`);
    }
    throw new Error('An unknown error occurred while deleting the product.');
  }
};

export const getDetailSingleImageData = (uuid:string): Promise<QueryResult<IDataProduct>> => {
  let query = `select (SELECT img_product
             FROM image_product
             WHERE product_id = p.id
             LIMIT 1) AS img_product,
             p.product_name ,
             p.product_price ,
             p2.discount_price 
    from products p 
    left join promos p2 on p.id = p2.product_id 
    where p.uuid = $1
    `;
  return db.query(query, [uuid]);
};