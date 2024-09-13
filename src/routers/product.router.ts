import { Router } from "express";
import { create, FetchAll, FetchDetail, update } from "../handlers/products/product.handler";
import { singleCloudUploader } from "../middleware/upload";

export const productRouter = Router()

productRouter.post("/add",singleCloudUploader("product"), create);
productRouter.get("/",FetchAll);
productRouter.patch("/setting/:uuid",update);
productRouter.get("/detail/:uuid", FetchDetail)