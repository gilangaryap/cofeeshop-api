import { QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataPaymentMethod, IPaymentMethodBody } from "../../models/transactions/payments.model";

export const createData = (body: IPaymentMethodBody ): Promise<QueryResult<IDataPaymentMethod>> => {
    const query = `insert into payments (payment_method)
    values ($1)
    returning *`;
    const { payment_method } = body;
    const values = [payment_method];
    return db.query(query,values);
}

export const getAllData = (): Promise<QueryResult<IDataPaymentMethod>> => {
    const query = `select * from payments`
    return db.query(query)
};

export const updateData = (id: string ,body: IPaymentMethodBody): Promise<QueryResult<IDataPaymentMethod>> => {
    const query = `update payments set payment_method = $2 where id = $1
    returning *`;
    const { payment_method }= body;
    const values = [ id , payment_method ];
    return db.query(query , values);
};

export const checkIfPaymentMethodExists = async (id:string) => {
    const query = `SELECT COUNT(*) AS count FROM payments WHERE id = $1`;
    const Ischeck = await db.query(query, [id]);
    return Ischeck.rows[0].count > 0;
};