import { Request, Response } from "express";
import { IDeliveryBody } from "../../models/transactions/shipping.model";
import { checkIfDeliveryExists, createData, getAllData, updateData } from "../../repository/transactions/shipping.repository";

export const create = async (req: Request <IDeliveryBody>, res: Response) => {
    try{
        const result = await createData(req.body);
        if (!result) {
            return res.status(404).json({
                msg: "Error",
                err: "Data Not Found",
            });
        }
        return res.status(201).json({
            msg: "success",
            data: result.rows,
        });
    }catch (err: unknown) {
              let errorMessage = "Internal Server Error";
              if (err instanceof Error) {
                  errorMessage = err.message;
                  if (errorMessage.includes('null value in column "delivery_method" of relation "delivery" violates not-null constraint')) {
                      errorMessage = "delivery method cannot be null";
                      return res.status(400).json({
                          msg: "Error",
                          err: errorMessage,
                      });
                  } 
              }
              return res.status(500).json({
                msg: "Error",
                err: "Internal Server Error",
              });
    }   
};

export const FetchAll = async (req: Request ,res: Response) => {
    const { id } = req.params;
    try {
      const result = await getAllData();
      return res.status(200).json({
          msg: "success",
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

export const update = async (req: Request ,res: Response) => {
    const { id } = req.params;
    try{
          const deliveryExists = await checkIfDeliveryExists(id);
          console.log(id)
          if (!deliveryExists) {
              return res.status(404).json({
                  msg: "ID delivery tidak ditemukan",
              });
          }
        const result = await updateData(id,req.body);
        return res.status(201).json({
            msg: "success",
            data: result.rows,
        });
    }catch (err: unknown) {
        let errorMessage = "Internal Server Error";
        if (err instanceof Error) {
            errorMessage = err.message;
            if (errorMessage.includes('duplicate key value violates unique constraint "unique_delivery_method"')) {
                errorMessage = "Delivery method are the same, no need to change";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            }
        }
          return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
          });
        }  
};