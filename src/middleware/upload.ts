import multer, { Field, Options, StorageEngine, memoryStorage } from "multer";
import path from "path";
import { NextFunction, Request, RequestHandler, Response } from "express";

const multerMemory = memoryStorage();

const createMulterOptions = (storageEngine: StorageEngine): Options => ({
  storage: storageEngine,
  limits: {
    fileSize: 52428800,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpg|png|jpeg|webp)$/i;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.test(fileExtension)) {
      return cb(new Error("Incorrect File"));
    }
    cb(null, true);
  },
});

const cloudUploader = multer(createMulterOptions(multerMemory));

export const singleCloudUploader = (fieldName: string) => {
  const singleCloud = cloudUploader.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    singleCloud(req, res, (err: unknown) => {
      const errorMessageMap: { [key: string]: string } = {
        LIMIT_PART_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FILE_SIZE: "The uploaded file size exceeds the limit.",
        LIMIT_FILE_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FIELD_KEY: "The uploaded field key is invalid.",
        LIMIT_FIELD_VALUE: "The uploaded field value is invalid.",
        LIMIT_FIELD_COUNT: "The number of uploaded fields exceeds the limit.",
        LIMIT_UNEXPECTED_FILE: "The uploaded file format is invalid.",
      };

      if (err instanceof multer.MulterError) {
        const message =
          errorMessageMap[err.code] ||
          "An error occurred while uploading the file.";
        return res.status(400).send({
          status: 400,
          msg: "MulterError",
          error: {
            message: message,
          },
        });
      }

      if (err) {
        if (err instanceof Error && err.message === "Incorrect File") {
          return res.status(400).send({
            status: 400,
            msg: "MulterError",
            error: {
              message: "Only JPG, PNG, or JPEG files are allowed.",
            },
          });
        }
        console.error("Unknown error:", err);
        return res.status(500).json({
          status: 500,
          msg: "MulterError",
          error: {
            message: "An error occurred while uploading the file.",
          },
        });
      }

      const files = req.files as Express.Multer.File[];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

     /*  if (!files || !files.every((file) => allowedMimeTypes.includes(file.mimetype))) {
        return res.status(400).send({
          message: "Only JPG, PNG, or JPEG files are allowed.",
        });
      }
 */
      next();
    });
  };
};


export const multiCloudUploader = ( fieldName: string, maxCount: number): RequestHandler => {
  const multiCloud = cloudUploader.array(fieldName, maxCount);
  return (req: Request, res: Response, next: NextFunction) => {
    multiCloud(req, res, (err: unknown) => {

      const errorMessageMap: { [key: string]: string } = {
        LIMIT_PART_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FILE_SIZE: "The uploaded file size exceeds the limit.",
        LIMIT_FILE_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FIELD_KEY: "The uploaded field key is invalid.",
        LIMIT_FIELD_VALUE: "The uploaded field value is invalid.",
        LIMIT_FIELD_COUNT: "The number of uploaded fields exceeds the limit.",
        LIMIT_UNEXPECTED_FILE: "The uploaded file format is invalid.",
      };
      if (err instanceof multer.MulterError) {
        const message =
          errorMessageMap[err.code] ||
          "An error occurred while uploading the file.";
        return res.status(400).send({
          status:400,
          msg:"MulterError",
          error:{
            massage:message,
          }
        });
      }

      if (err) {
        if (err instanceof Error && err.message === "Incorrect File") {
          return res.status(400).send({
            status: 400,
            msg: "MulterError",
            error: {
              message: "Only JPG, PNG, or JPEG files are allowed.",
            },
          });
        }
        console.error("Unknown error:", err);
        return res.status(500).json({
          status: 500,
          msg: "MulterError",
          error: {
            message: "An error occurred while uploading the file.",
          },
        });
      }
      const files = req.files as Express.Multer.File[];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

      if ( !files || !files.every((file) => allowedMimeTypes.includes(file.mimetype))) {
        return res
          .status(400)
          .send({ message: "Only JPG, PNG, or JPEG files are allowed." });
      }

      next();
    });
  };
};

export const multiFieldCloudUploader = (fieldName: Field[]) => {
  const multiFieldCloud = cloudUploader.fields(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    multiFieldCloud(req, res, (err: unknown) => {
      
     const errorMessageMap: { [key: string]: string } = {
        LIMIT_PART_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FILE_SIZE: "The uploaded file size exceeds the limit.",
        LIMIT_FILE_COUNT: "The number of uploaded files exceeds the limit.",
        LIMIT_FIELD_KEY: "The uploaded field key is invalid.",
        LIMIT_FIELD_VALUE: "The uploaded field value is invalid.",
        LIMIT_FIELD_COUNT: "The number of uploaded fields exceeds the limit.",
        LIMIT_UNEXPECTED_FILE: "The uploaded file format is invalid.",
      };
      if (err instanceof multer.MulterError) {
        const message =
          errorMessageMap[err.code] ||
          "An error occurred while uploading the file.";
        return res.status(400).send({
          status:400,
          msg:"MulterError",
          error:{
            massage:message,
          }
        });
      }

      if (err) {
        if (err instanceof Error && err.message === "Incorrect File") {
          return res.status(400).send({
            status: 400,
            msg: "MulterError",
            error: {
              message: "Only JPG, PNG, or JPEG files are allowed.",
            },
          });
        }
        console.error("Unknown error:", err);
        return res.status(500).json({
          status: 500,
          msg: "MulterError",
          error: {
            message: "An error occurred while uploading the file.",
          },
        });
      }
      const files = req.files as Express.Multer.File[];
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

      if ( !files || !files.every((file) => allowedMimeTypes.includes(file.mimetype))) {
        return res
          .status(400)
          .send({ message: "Only JPG, PNG, or JPEG files are allowed." });
      }

      next();
    });
  };
};