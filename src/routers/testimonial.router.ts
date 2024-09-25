import { Router } from "express";
import { create, FetchAll } from "../handlers/products/testimonial.handler";

export const testimonialRouter = Router()

testimonialRouter.post("/add/:id", create);
testimonialRouter.get("/",FetchAll);