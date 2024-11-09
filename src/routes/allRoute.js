import { Router } from "express";
import { getDataByTag } from "../controllers/all/all.controller.js";

const router = Router();

router.route("/getData/:tag").get(getDataByTag);

export default router;