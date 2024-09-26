import { Request, Response } from "express";
import { cloudinaryUploader } from "../../helpers/cloudinary";
import { getDetailData, updateData } from "../../repository/auth/profile.repository";

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let imageUrl: string | null = null;

    const parts = id.split('-');
    const resultId = parts[1];
    console.log(req.file)
    if (req.file) {
      const { result, error } = await cloudinaryUploader(req, "profile", resultId);
      if (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error(error.message);
      }
      if (!result?.secure_url) {
        throw new Error("Failed to upload image");
      }
      imageUrl = result.secure_url;
    }

    const data = await updateData(id, req.body, imageUrl as string);
    if (data.rowCount === 0) {
      return res.status(404).json({
        msg: "Profile not found",
        data: [],
      });
    }

    return res.status(200).json({
      msg: "success",
      data: data.rows,
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      if (/(invalid(.)+id(.)+)/g.test(err.message)) {
        return res.status(401).json({
          msg: "Error",
          err: "User not found",
        });
      }
    }
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
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