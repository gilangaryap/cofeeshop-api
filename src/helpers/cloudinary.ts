import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloud";
import DataURIParser from "datauri/parser";
import path from 'path';
import { Request } from "express-serve-static-core";

export interface CustomFilesRequest extends Request {
  files?: Express.Multer.File[];
}

export const cloudinaryUploader = async (req: CustomFilesRequest, prefix: string): Promise<{ results?: UploadApiResponse[]; errors?: Error[] }> => {
  
  const files = req.files; 
  if (!files || files.length === 0) return { errors: [new Error("No files found")] };

  const parser = new DataURIParser();
  const results: UploadApiResponse[] = [];
  const errors: Error[] = [];

  const maxFiles = Math.min(files.length, 3);

  for (let i = 0; i < maxFiles; i++) {
    const file = files[i];
    const { buffer } = file;
    const extName = path.extname(file.originalname);
    const base64File = parser.format(extName, buffer);
    
    if (!base64File.content) {
      errors.push(new Error(`Failed parsing file: ${file.originalname}`));
      continue;
    }

    const publicId = `${prefix}-${file.fieldname}-${i}`; 

    const uploadConfig: UploadApiOptions = {
      folder: "coffeeshops",
      public_id: publicId,
    };

    try {
      const result = await cloudinary.uploader.upload(base64File.content, uploadConfig);
      results.push(result);
    } catch (error) {
      if (!(error instanceof Error)) {
        console.log(error);
      }
      errors.push(error as Error);
    }
  }

  return { results, errors: errors.length > 0 ? errors : undefined };
};
