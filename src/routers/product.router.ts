import { Router } from "express";
import { create } from "../handlers/products/product.handler";
import { singleCloudUploader } from "../middleware/upload";

export const productRouter = Router()

productRouter.post("/add",singleCloudUploader("product"), create)