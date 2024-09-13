import { Pool, PoolClient, QueryResult } from "pg";
import { IDataTransaction, ITransaction_product, ITransactionBody, ITransactionProduct } from "../../models/transactions/transactions.model";

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
  