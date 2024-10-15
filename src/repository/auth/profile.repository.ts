import { Pool, PoolClient, QueryResult } from "pg";
import db from "../../configs/pg";
import { IDataProfile, IDetailData, IProfileBody } from "../../models/auth/profile.model";

export const createDataProfile = async (id: string, body: IProfileBody,dbPool: Pool | PoolClient): Promise<QueryResult<IDataProfile>> => {
  const query = `INSERT INTO profile (user_id, full_name, phone_number, address,profile_image)
                 VALUES ($1, $2, $3, $4,$5 )
                 RETURNING full_name, phone_number, address`;
  const { full_name, phone_number, address,profile_image} = body;
  const values = [id, full_name, phone_number, address,profile_image];
  
  return dbPool.query(query, values);
}


export const updateData = (id: string,body: IProfileBody,imgUrl?:string): Promise<QueryResult<IDataProfile>> => {
    let query = "";
    let values = [];

    const { full_name,phone_number,address } = body;

    if (full_name) {
      query += ` full_name = $${values.length + 1}, `;
      values.push(full_name);
    }

    if (phone_number) {
        query += ` phone_number = $${values.length + 1}, `;
        values.push(phone_number);
    }
  
    if (address) {
      query += ` address = $${values.length + 1}, `;
      values.push(address);
    }

    if (imgUrl) {
      query += `profile_image = $${values.length + 1}, `;
      values.push(imgUrl);
    }
    
    query = `UPDATE profile SET ${query.slice(0, -2)} WHERE user_id = $${
      values.length + 1
      } RETURNING full_name , phone_number , address , profile_image `;
      values.push(id);
      
    return db.query(query, values);
};



export const getDetailData = (id:string): Promise<QueryResult<IDetailData>> => {
    const query = `SELECT p.full_name, p.phone_number, p.address, p.profile_image, s.user_email , to_char(s.created_at, 'DD Month YYYY') AS created_at  FROM profile p INNER JOIN users s on p.user_id = s.id WHERE p.user_id = $1;`
    return db.query(query , [id])
};

export const findDataById = async (user_id: string): Promise<QueryResult<IDataProfile>> => {
  const query = 'SELECT * FROM profile WHERE user_id = $1';
  return db.query(query , [user_id])
};

