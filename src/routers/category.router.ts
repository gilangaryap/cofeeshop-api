import { Router } from "express";
import { create, FetchAll, update } from "../handlers/products/category.handler";
import { authorization } from "../middleware/authorization.middleware";

export const categoryRouter = Router()

categoryRouter.post("/add", create);
categoryRouter.get("/",FetchAll);
categoryRouter.patch("/setting/:id",authorization('ADMIN'),update);
