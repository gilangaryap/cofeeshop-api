import { Request, Response } from "express";
import { IPromoBody } from "../../models/products/promo.model";
import { createData, DelateData, getAllData } from "../../repository/products/promo.repository";


export const create = async (req: Request<{ id: string }, {}, IPromoBody>, res: Response) => {
    const { id } = req.params;
    try {
        const result = await createData(req.body, id); 
        return res.status(201).json({
            msg: "success",
            data: result.rows,
        });
    } catch (err: unknown) {
        console.error('Error details:', err);
        if (err instanceof Error) {
            return res.status(500).json({
                code: 500,
                msg: "Error",
                error:{
                    massage: err.message,
                } 
            });
        } else {
            return res.status(500).json({
                msg: "Error",
                error: "Internal Server Error",
            });
        }
    }
};

export const FetchAll = async (req:Request,res:Response) => {
    try{
        const result = await getAllData()
        return res.status(201).json({
            msg: "success",
            data: result.rows,
        });
    } catch (err: unknown) {
        console.error('Error details:', err);
        if (err instanceof Error) {
            return res.status(500).json({
                msg: "Error",
                error: err.message,
            });
        } else {
            return res.status(500).json({
                msg: "Error",
                error: "Internal Server Error",
            });
        }
    }
};

export const Delate = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await DelateData(id); 
        return res.status(200).json({
            msg: "Success",
            data: result,
        });
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Internal Server Error";
      return res.status(500).json({
        code: 500,
        msg: "Error",
        err: errorMessage,
    });
    }
  }