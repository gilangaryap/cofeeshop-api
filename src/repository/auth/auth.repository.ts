import { QueryResult } from "pg";
import db from "../../configs/pg";
import { IAuth } from "../../models/auth/auth.model";


export const GetByEmail = (email: string): Promise<QueryResult<IAuth>> => {
    const query = `select user_pass , id from users where user_email = $1`;
    const values = [email];
    return db.query(query, values);
  };