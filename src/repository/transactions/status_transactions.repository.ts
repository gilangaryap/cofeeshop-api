import { QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataStatusTransaction, IStatusTransactionBody } from "../../models/transactions/status_transactions.model";

export const createData = (body: IStatusTransactionBody): Promise<QueryResult<IDataStatusTransaction>> => {
    const query = `insert into status_transactions (status)
    values ($1)
    returning * `
    const { status } = body;
    const values = [ status ];
    return db.query(query, values);
}

export const getData = (): Promise<QueryResult<IDataStatusTransaction>> => {
    const query = ` select * from status_transactions`
    return db.query(query);
};

export const updateData = (id: string , body: IStatusTransactionBody): Promise<QueryResult<IDataStatusTransaction>> => {
    const query = ` update status_transactions set status = $2 where id = $1
    returning * `
    const { status }  = body ;
    const values = [ id , status ];
    return db.query( query , values );
};
