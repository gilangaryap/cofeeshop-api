import { Request, Response } from "express";
import { cloudinaryUploader } from "../../helpers/cloudinary";
import { getDetailData, updateData } from "../../repository/auth/profile.repository";
import { IDataProfileResponse, IDetailDataResponse } from "../../models/auth/profile.model";

export const update = async (req: Request, res: Response<IDataProfileResponse>) => { 
  const { id } = req.params;

  try {
    let imageUrl: string | null = null;

    const parts = id.split('-');
    const resultId = parts[1];

    if (req.file) {
      const { result, error } = await cloudinaryUploader(req, "profile", resultId);
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          code: 500,
          msg: "Failed to upload image",
          error: {
            message: error.message,
          },
        });
      }
      if (!result?.secure_url) {
        return res.status(500).json({
          code: 500,
          msg: "Failed to upload image",
          error: {
            message: "Secure URL is missing",
          },
        });
      }
      imageUrl = result.secure_url;
    }

    const data = await updateData(id, req.body, imageUrl as string);
    
    return res.status(200).json({
      code: 200,
      msg: "Success",
      data: data.rows,
    });

  } catch (err) {
    console.error("Update error:", err);
    let errorMessage = "An unexpected error occurred";

    if (err instanceof Error) {
      if (/(invalid(.)+id(.)+)/g.test(err.message)) {
        errorMessage = "Invalid ID provided";
      }
    }

    return res.status(400).json({
      code: 400,
      msg: errorMessage,
      error: {
        message: errorMessage,
      },
    });
  }
};


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