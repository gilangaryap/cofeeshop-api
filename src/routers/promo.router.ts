import { Router } from "express";
import { create, Delate, FetchAll } from "../handlers/products/promo.handler";
import { singleCloudUploader } from "../middleware/upload";

export const promoRouter = Router()

promoRouter.post("/add/:id", singleCloudUploader("promoImage"), create)
promoRouter.get("/", FetchAll)
promoRouter.delete("/:id" , Delate)