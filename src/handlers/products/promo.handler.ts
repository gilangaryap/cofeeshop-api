import { Request, Response } from "express";
import { IPromoBody } from "../../models/products/promo.model";
import { createData, getAllData } from "../../repository/products/promo.repository";


export const create = async (req: Request<{ id: string }, {}, IPromoBody>, res: Response) => {
    const { id } = req.params;
    try {
        console.log('Inserting data:', {
            id: id,
            discount_price: req.body.discount_price,
            promo_name: req.body.promo_name,
            promo_description: req.body.promo_description,
            product_id: req.body.product_id
        });
        
        const result = await createData(req.body, id); 

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