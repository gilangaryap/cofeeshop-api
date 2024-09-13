import { Request, Response } from "express";
import { ICategoriesResponse } from "../../models/products/category.model";
import { checkIfCategoryExists, createData, getAllData, updateData } from "../../repository/products/category.repository";

export const create= async (req: Request, res: Response<ICategoriesResponse>) => {
    try {
        const result = await createData(req.body);
        return res.status(200).json({
            msg: "success",
            data: result.rows,
        });
    } catch (err) {
        let errorMessage = "Internal Server Error";
        if (err instanceof Error) {
            errorMessage = err.message;
            if (errorMessage.includes('null value in column "categorie_name" of relation "categories" violates not-null constraint')) {
                errorMessage = "Category name cannot be null";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            } 
            if (errorMessage.includes('duplicate key value violates unique constraint "unique_categorie_name"')) {
                errorMessage = "Categorie name already exists";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            }
            if (errorMessage.includes('duplicate key value violates unique constraint "unique_delivery_method"')) {
                errorMessage = "Categorie name are the same, no need to change";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            }
        }
        console.log(errorMessage);
        return res.status(500).json({
            msg: "Error",
            err: errorMessage,
        });
    }
};

export const FetchAll = async (req: Request, res: Response<ICategoriesResponse>) => {
    try{
        const result = await getAllData();
        return res.status(200).json({
            msg: "succes",
            data: result.rows,
        });
    }catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
              }
              return res.status(500).json({
                msg: "Error",
                err: "Internal Server Error",
              });
    }
};

export const update = async (req: Request, res: Response<ICategoriesResponse>) => {
    const  { id } = req.params;
    try{
        const categoryExists = await checkIfCategoryExists(id);
        if (!categoryExists) {
            return res.status(404).json({
                msg: "Category ID not found",
            });
        }
        const result = await updateData(id,req.body);
        return res.status(200).json({
            msg: "succes",
            data: result.rows
        });
    }catch (err: unknown) {
        let errorMessage = "Internal Server Error";
        if (err instanceof Error) {
            errorMessage = err.message;
            if (errorMessage.includes('null value in column "categorie_name" of relation "categories" violates not-null constraint')) {
                errorMessage = "Category name cannot be null";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            } 
        }
        console.log(errorMessage);
        return res.status(500).json({
            msg: "Error",
            err: errorMessage,
        });
    }
}