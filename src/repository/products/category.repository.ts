import { QueryResult } from "pg";
import db from "../../configs/pg";
import { ICategoriesBody, IDataCategories } from "../../models/products/category.model";

export const createData = (body: ICategoriesBody ): Promise<QueryResult<IDataCategories>> => {
    const query = `insert into categories (categorie_name)
    values ($1)
    returning categorie_name`;
    const { categorie_name } = body;
    const values = [categorie_name];
    return db.query(query,values);
}

export const getAllData = (): Promise<QueryResult<IDataCategories>> => {
    const query = `select categorie_name from categories`
    return db.query(query)
}

export const updateData = (id: string, body: ICategoriesBody): Promise<QueryResult<IDataCategories>> => {
    const query = `update categories 
                   set categorie_name = $2
                   where id = $1 
                   RETURNING categorie_name`;
    const { categorie_name } = body;
    const values = [id,categorie_name];
    return db.query(query, values);
};

export const checkIfCategoryExists = async (id:string) => {
    const query = `SELECT COUNT(*) AS count FROM categories WHERE id = $1`;
    const Ischeck = await db.query(query, [id]);
    return Ischeck.rows[0].count > 0;
};