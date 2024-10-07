import { Router } from "express";
import { getDataOfLang } from "../controllers/programmingLanguage/programmingLanguage.controller.js";

const router = Router();

router.route("/getData").get(getDataOfLang);

export default router;