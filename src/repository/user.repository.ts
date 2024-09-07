import { QueryResult } from "pg";
import db from "../configs/pg";
import { IDataUser } from "../models/user.model";

export const createData = (hashedPassword: string,email: string): Promise<QueryResult<IDataUser>> => {
    const query = `
    INSERT INTO users ( user_email, user_pass)
    VALUES ($1, $2)
    RETURNING user_email , uuid `;
    const values = [ email, hashedPassword];
    return db.query(query, values);
};