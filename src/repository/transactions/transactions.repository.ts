import { Pool, PoolClient, QueryResult } from "pg";
import { IDataTransaction, ITransaction_product, ITransactionBody, ITransactionProduct, ITransactionQuery } from "../../models/transactions/transactions.model";
import db from "../../configs/pg";

export const createData = (body: ITransactionBody,dbPool: Pool | PoolClient): Promise<QueryResult<IDataTransaction>> => {
    const query = `insert into transactions ( user_id , payments_id ,shipping_id , status_id , subtotal , tax , total_discount , grand_total )
      values ($1,$2,$3,$4,$5,$6,$7,$8)
      returning *`;
    const{ user_id , payments_id , shipping_id , status_id , subtotal , tax , total_discount , grand_total,} = body;
    const values = [ user_id , payments_id , shipping_id , status_id , subtotal , tax , total_discount , grand_total];
    console.log(values, query);
    return dbPool.query(query, values);
};

export const createDataProduct = (transaction_id: string,product: ITransaction_product,dbPool:Pool | PoolClient): Promise<QueryResult<ITransactionProduct>> => {
    const query = `insert into transaction_product (  transaction_id , product_id , size_id  )
      values ($1,$2,$3)
      returning *`;
    const { product_id, size_id } = product;
    const values = [transaction_id, product_id, size_id];
    console.log(query, values);
  
    return dbPool.query(query, values);
};

export const getAllData = (queryParams: ITransactionQuery,id:string) => {
  let query = `
    SELECT
        tp.id,
        (SELECT img_product 
         FROM image_product 
         WHERE product_id = p.id 
         LIMIT 1) AS img_product,
        t.order_number,
        TO_CHAR(t.created_at, 'DD Mon YYYY') AS created_date,
        p.product_price,
        st.status 
    FROM 
        transaction_product tp
        INNER JOIN products p ON tp.product_id = p.id
        INNER JOIN transactions t ON tp.transaction_id = t.id
        INNER JOIN status_transactions st ON t.status_id = st.id 
        INNER JOIN users u ON t.user_id = u.id
  `;

  const values: any[] = [];
  const { status, page, limit} = queryParams;
  const conditions: string[] = [];

  if (status) {
    let statusFilter = "";
    switch (status.toLowerCase()) {
      case "1":
        statusFilter = `st.status = 'On Progress'`;
        break;
      case "2":
        statusFilter = `st.status = 'Sending Goods'`;
        break;
      case "3":
        statusFilter = `st.status = 'Finish Order'`;
        break;
      default:
        throw new Error("Invalid status");
    }
    conditions.push(statusFilter);
  }

  if (id) {
    values.push(id); 
    conditions.push(`u.id = $${values.length}`); 
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (page && limit) {
    const pageLimit = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageLimit;

    values.push(pageLimit, offset);
    query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;
  }

  return db.query(query, values);
};

export const getTotalTransaction = ( uuid: string): Promise<QueryResult<{ total_product: string }>> => {
  let query = `select count(*) as total_product from transaction_product tp
    INNER JOIN transactions t ON tp.transaction_id = t.id
    INNER JOIN users u ON t.user_id = u.id 
    WHERE u.id = $1;`;
  return db.query(query, [uuid]);
};
  