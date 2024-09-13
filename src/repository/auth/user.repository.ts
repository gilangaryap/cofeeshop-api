import { Pool, PoolClient, QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataUser, IUserBody, IUsersQuery } from "../../models/auth/user.model";

export const createData = (hashedPassword: string,email: string,dbPool: Pool | PoolClient): Promise<QueryResult<IDataUser>> => {
  const query = `
    INSERT INTO users ( user_email, user_pass , role)
    VALUES ($1, $2 , 'user' )
    RETURNING user_email , id `;
  const values = [email, hashedPassword];
  return dbPool.query(query, values);
};

export const getAllData = (queryParams: IUsersQuery): Promise<QueryResult<IDataUser>> => {
  let query = ` select id , user_email from users order by created_at asc`;
  let value = [];
  const { page, limit } = queryParams;

  if (page && limit) {
    const pageLimit = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageLimit;
    query += ` limit $${value.length + 1} offset $${value.length + 2}`;
    value.push(pageLimit, offset);
  }

  return db.query(query, value);
};

export const getTotalData = (): Promise<QueryResult<{ total_user: string }>> => {
  let query = 'select count(*) as "total_user" from users';
  return db.query(query);
};

export const updateData = (id: string,body: IUserBody,hashedPassword?: string): Promise<QueryResult<IDataUser>> => {
  let query = "";
  let values = [];

  const { user_email } = body;

  if (user_email) {
    query += `user_email = $${values.length + 1}, `;
    values.push(user_email);
  }
  console.log("ini dari body:",user_email)

  if (hashedPassword) {
    query += `user_pass = $${values.length + 1}, `;
    values.push(hashedPassword);
  }

  console.log("ini pass:", hashedPassword);
  
  query = `UPDATE users SET ${query.slice(0, -2)}, updated_at = now() WHERE id = $${values.length + 1} RETURNING user_email, updated_at;`;
  values.push(id);

  return db.query(query, values);
};

export const checkIfUsereExists = async (id: string) => {
    const query = `SELECT COUNT(*) AS count FROM users WHERE users_id = $1`;
    const Ischeck = await db.query(query, [id]);
    return Ischeck.rows[0].count > 0;
};
