import { Router } from "express";
import { getDataById, getDataOfLang } from "../controllers/programmingLanguage/programmingLanguage.controller.js";

const router = Router();

router.route("/getData").get(getDataOfLang);
router.route("/getData/:id").get(getDataById);

export default router;