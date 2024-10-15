import { Request, Response } from "express";
import {
  getDetailData,
  updateData,
} from "../../repository/auth/profile.repository";
import { IDetailDataResponse } from "../../models/auth/profile.model";
import { cloudinarySingleUploader } from "../../helpers/cloudinary";


export const Update = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    const { id } = req.params;
    let profileImage: string | undefined;

    if (file) {
      const { result , error } = await cloudinarySingleUploader(req, "product-image" , id);
      if (error) {
        throw new Error(error.message);
      }
      if (!result || !result.secure_url) {
        throw new Error("Failed to upload image");
      }
      profileImage = result.secure_url
    }

    const result = await updateData(id, req.body, profileImage);
    if (!result || result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Update error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: errorMessage,
      },
    });
  }
};


export const FetchDetail = async (
  req: Request,
  res: Response<IDetailDataResponse>
) => {
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
