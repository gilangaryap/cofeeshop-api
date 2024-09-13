import { Request, Response } from "express";
import { IStatusTransactionBody } from "../../models/transactions/status_transactions.model";
import { createData, getData, updateData } from "../../repository/transactions/status_transactions.repository";

export const create = async (req: Request<IStatusTransactionBody> ,res: Response) => {
    try{
        const result = await createData(req.body);
        return res.status(201).json({
            msg: "success",
            data: result.rows,
        });
    }catch (err: unknown) {
      let errorMessage = "Internal Server Error";
      if (err instanceof Error) {
          errorMessage = err.message;
          if (errorMessage.includes('duplicate key value violates unique constraint "unique_status"')) {
              errorMessage = "Duplicate status transction name";
              return res.status(400).json({
                  msg: "Error",
                  err: errorMessage,
              });
          }
      }
      return res.status(500).json({
          msg: "Error",
          err: errorMessage,
      });
  }
};

export const FetchAll = async (req: Request ,res: Response) => {
    try{
        const result = await getData();
        return res.status(201).json({
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
}

export const update = async (req: Request ,res: Response) => {
    const { id } = req.params
    try{
        const result = await updateData(id , req.body);
        return res.status(201).json({
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
}
  