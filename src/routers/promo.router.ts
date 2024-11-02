import { Router } from "express";
import { create, Delate, FetchAll } from "../handlers/products/promo.handler";
import { singleCloudUploader } from "../middleware/upload";
import { authorization } from "../middleware/authorization.middleware";

export const promoRouter = Router()

promoRouter.post("/add/:id", singleCloudUploader("promoImage"),authorization(['admin']), create)
promoRouter.get("/", FetchAll)
promoRouter.delete("/:id" ,authorization(['admin']), Delate)