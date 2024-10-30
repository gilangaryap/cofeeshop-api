import { Pool, PoolClient, QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataUser, IUserBody, IUserProfileData, IUsersQuery } from "../../models/auth/user.model";

export const createData = (hashedPassword: string,email: string,dbPool: Pool | PoolClient): Promise<QueryResult<IDataUser>> => {
  const query = `
    INSERT INTO users ( user_email, user_pass)
    VALUES ($1, $2  )
    RETURNING user_email , id `;
  const values = [email, hashedPassword];
  return dbPool.query(query, values);
};

export const getAllData = (queryParams: IUsersQuery): Promise<QueryResult<IUserProfileData>> => {
  let query = ` select u.id, p.profile_image, p.full_name,p.phone_number,p.address , user_email from users u inner join profile p on u.id = p.user_id 
order by created_at asc`;
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

export const updateData = (id: string, body: IUserBody, hashedPassword?: string): Promise<QueryResult<IDataUser>> => {
  let queryParts: string[] = [];
  let values: (string | undefined)[] = [];

  const { user_email } = body;

  if (user_email) {
    queryParts.push(`user_email = $${values.length + 1}`);
    values.push(user_email);
  }

  if (hashedPassword) {
    queryParts.push(`user_pass = $${values.length + 1}`);
    values.push(hashedPassword);
  }

  if (queryParts.length === 0) {
    return Promise.reject(new Error("No fields to update"));
  }

  const query = `UPDATE users SET ${queryParts.join(", ")}, updated_at = now() WHERE id = $${values.length + 1} RETURNING user_email, updated_at;`;
  values.push(id);

  return db.query(query, values);
};

export const checkIfUserExists = async (id: string) => {
    const query = `SELECT COUNT(*) AS count FROM users WHERE users_id = $1`;
    const IsCheck = await db.query(query, [id]);
    return IsCheck.rows[0].count > 0;
};
