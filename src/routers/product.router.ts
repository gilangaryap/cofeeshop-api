import { Router } from "express";
import { create, FetchAll, FetchDetail, update, updateImage , Delate, FetchSingleImageDetail } from "../handlers/products/product.handler";
import { multiCloudUploader } from "../middleware/upload";
import { authorization } from "../middleware/authorization.middleware";

export const productRouter = Router()


productRouter.post("/add", multiCloudUploader("imageHandler", 3),authorization(['admin']) , create);
productRouter.get("/",FetchAll);
productRouter.patch("/setting/image/:uuid",multiCloudUploader("imageHandler", 3),authorization(['admin']),updateImage);
productRouter.patch("/setting/:uuid",authorization(['admin']), update);
productRouter.get("/detail-card/:uuid", FetchSingleImageDetail)
productRouter.get("/detail/:uuid", FetchDetail)
productRouter.delete("/delete/:uuid",authorization(['admin']), Delate)