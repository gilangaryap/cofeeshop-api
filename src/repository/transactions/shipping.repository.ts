import { QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataDelivery, IDeliveryBody } from "../../models/transactions/shipping.model";


export const createData = (body: IDeliveryBody ): Promise<QueryResult<IDataDelivery>> => {
    const query = `insert into shipping ( shipping_method , minimum_cost , minimum_distance , added_cost )
    values ( $1 , $2 , $3 , $4 )
    returning shipping_method , minimum_cost , minimum_distance , added_cost`;
    const { shipping_method ,minimum_cost ,minimum_distance ,added_cost } = body;
    const values = [ shipping_method ,minimum_cost ,minimum_distance ,added_cost ];
    console.log(values,query )
    return db.query(query,values);
}

export const getAllData  = (): Promise<QueryResult<IDataDelivery>> => {
    const query = ` select * from shipping`;
    return db.query(query)
};

export const updateData = (id:string , body: IDeliveryBody): Promise<QueryResult<IDataDelivery>> => {
    let query = ` update shipping set `;
    let values = [];

    const { shipping_method ,minimum_cost ,minimum_distance ,added_cost } = body;

    if (shipping_method?.length > 0) {
        query += `shipping_method = $${values.length + 1}, `;
        values.push(shipping_method);
    }

    if (minimum_cost >= 0) {
        query += `minimum_cost = $${values.length + 1}, `;
        values.push(minimum_cost);
    }

    if (minimum_distance >= 0) {
        query += `minimum_distance = $${values.length + 1}, `;
        values.push(minimum_distance);
    }

    if (added_cost >= 0) {
        query += `added_cost = $${values.length + 1}, `;
        values.push(added_cost);
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${values.length + 1} returning  *  `;
    values.push(id);

    console.log(values,query)

    return db.query(query, values);
};

export const checkIfDeliveryExists = async (id:string) => {
    const query = `SELECT COUNT(*) AS count FROM shipping WHERE id = $1`;
    const Ischeck = await db.query(query, [id]);
    return Ischeck.rows[0].count > 0;
};