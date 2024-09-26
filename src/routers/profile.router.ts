import { Router } from "express";
import { singleCloudUploader } from "../middleware/upload";
import { FetchDetail, update } from "../handlers/auth/profile.handlers";

export const profileRouter = Router();

profileRouter.patch("/setting/:id", singleCloudUploader("profile") , update )
profileRouter.get("/:id", FetchDetail)