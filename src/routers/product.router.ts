import { Router } from "express";
import { create, FetchAll, FetchDetail, FetchDetailImg } from "../handlers/products/product.handler";
import { multiCloudUploader } from "../middleware/upload";

export const productRouter = Router()


productRouter.post("/add",multiCloudUploader("imagesField", 2), create);
productRouter.get("/",FetchAll);
/* productRouter.patch("/setting/:uuid",update);
 */productRouter.get("/detail/:uuid", FetchDetail)
productRouter.get("/order-payment/:uuid", FetchDetailImg)