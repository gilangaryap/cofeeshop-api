import { QueryResult } from "pg";
import { IUsersQuery } from "../../models/auth/user.model";
import { IDataTestimonial, IDataTestimonialBody } from "../../models/products/testimonial.model";
import db from "../../configs/pg";


export const createData = (body: IDataTestimonialBody,id: string): Promise<QueryResult<IDataTestimonial>> => {
    let query = `insert into testimonial (user_id , comment , rating)
      values ($1 , $2 , $3 )
      returning * `

    const {comment,rating} = body;
    const values = [id , comment,rating];
    return db.query(query,values);
};

export const getAllData = (queryParams: IUsersQuery): Promise<QueryResult<IDataTestimonial>> => {
  let query = `
      SELECT u."role" , p.full_name , p.profile_image , u.user_email , u.id , t."comment" , t.rating 
      FROM testimonial t
      INNER JOIN users u ON t.user_id = u.id
      INNER JOIN profile p ON u.id = p.user_id 
    `;
  let values: any[] = [];
  const { page, limit } = queryParams;
  if (page && limit) {
    const pageLimit = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * pageLimit;
    query += ` ORDER BY u.full_name LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    values.push(pageLimit, offset);
  } else {
    query += " ORDER BY p.full_name";
  }

  return db.query(query, values);
};

export const getTotalTestimonialData = (): Promise<QueryResult<{ total_user: string }>> => {
  let query = 'select count(*) as "total_user" from testimonial';
  return db.query(query);
};
