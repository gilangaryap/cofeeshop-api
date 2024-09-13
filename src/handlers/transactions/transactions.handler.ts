import { Request, Response } from "express";
import { ITransactionResponse, ITransactionWithDetailsBody } from "../../models/transactions/transactions.model";
import db from "../../configs/pg";
import { createData, createDataProduct } from "../../repository/transactions/transactions.repository";

export const create = async (req: Request<{}, {}, ITransactionWithDetailsBody>,res: Response<ITransactionResponse>) => {
    try {
      const client = await db.connect();
      try {
        await client.query("BEGIN");
  
        const orderResult = await createData(req.body, client);
        const transaction_id = orderResult.rows[0].id;
  
        const detailResultPromises = req.body.products.map((product) =>
          createDataProduct(transaction_id, product, client)
        );
  
        const detailResults = await Promise.all(detailResultPromises);
  
        const ordersWithDetails = orderResult.rows.map((order, index) => ({
          ...order,
          products: detailResults[index].rows,
        }));
        await client.query("COMMIT");
        return res.status(201).json({
          msg: "Success",
          data: ordersWithDetails,
        });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return res.status(500).json({
        msg: "Error",
        err: "Internal Server Error",
      });
    }
  };