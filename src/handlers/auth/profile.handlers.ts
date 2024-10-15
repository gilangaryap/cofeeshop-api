import { Request, Response } from "express";
import { getDetailData,  } from "../../repository/auth/profile.repository";
import { IDetailDataResponse } from "../../models/auth/profile.model";

export const FetchDetail = async (req: Request, res: Response<IDetailDataResponse>) => {
  const { id } = req.params;

  try {
    const result = await getDetailData(id);
    if (!result.rows.length) {
      return res.status(404).json({
        code: 404,
        msg: "Data not found",
        error: {
          message: "No details found for the given ID",
        },
      });
    }

    return res.status(200).json({
      code: 200,
      msg: "Success",
      data: result.rows,
    });

  } catch (err: unknown) {
    console.error("FetchDetail error:", err);

    let errorMessage = "Internal Server Error";
    if (err instanceof Error) {
      errorMessage = err.message; 
    }

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: errorMessage,
      },
    });
  }
};