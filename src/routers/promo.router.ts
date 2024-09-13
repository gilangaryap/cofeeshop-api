import { Router } from "express";
import { create } from "../handlers/products/promo.handler";
import { singleCloudUploader } from "../middleware/upload";

export const promoRouter = Router()

promoRouter.post("/add",singleCloudUploader("promo"), create)