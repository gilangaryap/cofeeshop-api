import { Request, Response } from "express";
import { cloudinaryUploader } from "../../helpers/cloudinary";
import { getDetailData, updateData } from "../../repository/auth/profile.repository";

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let imageUrl: string | null = null;

    const idString = id;
    const parts = idString.split('-');
    const resultId = parts[1];

    if (req.file) {
      const { result, error } = await cloudinaryUploader(req, "product-image", resultId);
      if (error) {
        throw new Error(error.message);
      }
      if (!result || !result.secure_url) {
        throw new Error("Failed to upload image");
      }
      imageUrl = result.secure_url;
    }

    console.log("body: ",req.body)
    const data = await updateData(id, req.body, imageUrl as string);
    return res.status(200).json({
      msg: "succes",
      data: data.rows,
    });
  } catch (err: unknown) {
    console.error('Error in update function:', err);
    return res.status(500).json({
      msg: "Error",
      error: err instanceof Error ? err.message : 'Internal Server Error',
    });
  }
};

export const FetchDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await getDetailData(id);
    return res.status(200).json({
      msg: "succes",
      data: result.rows,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};