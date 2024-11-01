import { Router } from "express";
import { create, FetchAll, FetchDetail, update, updateImage , Delate, FetchSingleImageDetail } from "../handlers/products/product.handler";
import { multiCloudUploader } from "../middleware/upload";

export const productRouter = Router()


productRouter.post("/add", multiCloudUploader("imageHandler", 3) , create);
productRouter.get("/",FetchAll);
productRouter.patch("/setting/image/:uuid",multiCloudUploader("imageHandler", 3),updateImage);
productRouter.patch("/setting/:uuid", update);
productRouter.get("/detail-card/:uuid", FetchSingleImageDetail)
productRouter.get("/detail/:uuid", FetchDetail)
productRouter.delete("/delete/:uuid", Delate)