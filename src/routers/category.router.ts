import { Router } from "express";
import { create, FetchAll, update } from "../handlers/products/category.handler";

export const categoryRouter = Router()

categoryRouter.post("/add", create);
categoryRouter.get("/", FetchAll);
categoryRouter.patch("/setting/:id",update);
