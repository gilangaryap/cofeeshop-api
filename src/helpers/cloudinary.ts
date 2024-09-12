import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloud";
import DataURIParser from "datauri/parser";
import path from 'path';
import { Request } from "express-serve-static-core";

export const cloudinaryUploader = async (req: Request,prefix: string,id?: string): Promise<{ result?: UploadApiResponse; error?: Error }> => {
  
  const { file } = req;
  if (!file) return { error: Error("File not found") };
  const { buffer } = file;

  const parser = new DataURIParser();
  const extName = path.extname(file.originalname);
  const base64File = parser.format(extName, buffer);
  if (!base64File.content) return { error: new Error("Failed Parsing") };

  const publicId = `${prefix}-${file.fieldname}-${id}`;

  try {
    const uploadConfig: UploadApiOptions = {
      folder: "coffeeshops",
      public_id: publicId,
    };
    const result = await cloudinary.uploader.upload(base64File.content, uploadConfig);
    return { result };
  } catch (error) {
    if (!(error instanceof Error)) {
      console.log(error);
    }
    return { error: error as Error };
  }
};