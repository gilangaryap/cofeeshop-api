import { QueryResult } from "pg";
import db from "../configs/pg";
import { IDataUser, IUserBody, IUsersQuery } from "../models/user.model";

export const createData = (hashedPassword: string,email: string): Promise<QueryResult<IDataUser>> => {
  const query = `
    INSERT INTO users ( user_email, user_pass , role)
    VALUES ($1, $2 , 'user' )
    RETURNING user_email `;
  const values = [email, hashedPassword];
  return db.query(query, values);
};

export const getAllData = (queryParams: IUsersQuery): Promise<QueryResult<IDataUser>> => {
  let query = ` select user_email , uuid from users order by created_at asc`;
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

export const getDetailData = (uuid: string): Promise<QueryResult<IDataUser>> => {
  const query = ` SELECT
      full_name , user_img , user_email , user_phone, 
      address, to_char(created_at, 'DD Month YYYY') AS created_at
  FROM
      users
  WHERE
      uuid = $1;
  `;
  const values = [uuid];
  return db.query(query, values);
};

export const getTotalData = (): Promise<
  QueryResult<{ total_user: string }>
> => {
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

  if (hashedPassword) {
    query += `user_pass = $${values.length + 1}, `;
    values.push(hashedPassword);
  }
  
  query = `UPDATE users SET ${query.slice(0, -2)}, updated_at = now()  WHERE id = $${
    values.length + 1
  } RETURNING user_email , updated_at  ;`;
  values.push(id);

  return db.query(query, values);
};

export const deleteData = (id: string): Promise<QueryResult<IDataUser>> => {
  const query = `update users set is_deleted = true
      where id = $1
      returning *`;
  const values = [id];
  return db.query(query, values);
};

export const checkIfUsereExists = async (id: string) => {
    const query = `SELECT COUNT(*) AS count FROM users WHERE users_id = $1`;
    const Ischeck = await db.query(query, [id]);
    return Ischeck.rows[0].count > 0;
};
