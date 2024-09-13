import { Pool, PoolClient, QueryResult } from "pg";
import { IDataproduct, IProductBody, IProductQuery } from "../../models/products/product.model";
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

export const getAllData = async (queryParams: IProductQuery): Promise<QueryResult<IDataproduct>> => {
  let query = ` 
      select products.uuid, products.product_name, products.product_price, products.product_description, p2.discount_price, c.categorie_name,
         (SELECT img_product FROM image_product WHERE product_id = products.id LIMIT 1) AS img_product
      FROM products
          inner join categories c on products.category_id = c.id 
          LEFT JOIN promo p2 ON products.id = p2.product_id
      `;
  let value = [];

  let whereAdd = false;

  const {category,maximumPrice,minimumPrice,searchText,promo,sortBy,page,limit,} = queryParams;

  if (promo) {
    query += ` inner join promo on products.id = promo.product_id `;
  }

  if (minimumPrice && maximumPrice ) {
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

  console.log(query ,  value)
  return db.query(query, value);
};

export const getTotalData = (): Promise<QueryResult<{ total_product: string }>> => {
  let query = 'select count(*) as total_product from products';
  return db.query(query);
};