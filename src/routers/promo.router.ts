import { Router } from "express";
import { create, FetchAll } from "../handlers/products/promo.handler";

export const promoRouter = Router()

promoRouter.post("/add/:id", create)
promoRouter.get("/", FetchAll)