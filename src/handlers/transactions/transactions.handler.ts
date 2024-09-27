import { Request, Response } from "express";
import { ITransactionQuery, ITransactionResponse, ITransactionWithDetailsBody } from "../../models/transactions/transactions.model";
import db from "../../configs/pg";
import { createData, createDataProduct, getAllData, getTotalTransaction } from "../../repository/transactions/transactions.repository";
import getLink from "../../helpers/getLink";

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

export const FetchAll = async (req: Request<{ id: string }, {}, {}, ITransactionQuery>,res: Response
) => {
  try {
    const { id } = req.params;

    const result = await getAllData(req.query,id);

    const dataTransaction = await getTotalTransaction(id);

    if (dataTransaction.rows.length === 0) {
      return res.status(404).json({
        msg: "Error",
        err: "Transaction Data Not Found",
      });
    }

    const totalData = parseInt(dataTransaction.rows[0].total_product);

    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt(req.query.limit as string || "4");

    const totalPage = Math.ceil(totalData / limit);

    return res.status(200).json({
      msg: "success",
      data: result.rows,
      pagination: {
        totalData,
        totalPage,
        page,
        prevLink: page > 1 ? getLink(req, "previous") : null,
        nextLink: page != totalPage ? getLink(req, "next") : null,
      },
    });
  } catch (err) {
    // Menangani kesalahan internal server
    console.error("Internal Server Error:", err);
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};