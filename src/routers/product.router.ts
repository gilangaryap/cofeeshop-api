import { Router } from "express";
import { create, FetchAll, FetchDetail, FetchDetailImg, update } from "../handlers/products/product.handler";
import { multiCloudUploader } from "../middleware/upload";

export const productRouter = Router()

const uploadFieldName = 'files';
const maxFileCount = 3;

productRouter.post("/add",multiCloudUploader(uploadFieldName, maxFileCount), create);
productRouter.get("/",FetchAll);
productRouter.patch("/setting/:uuid",update);
productRouter.get("/detail/:uuid", FetchDetail)
productRouter.get("/order-payment/:uuid", FetchDetailImg)