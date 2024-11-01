import { Router } from "express";
import { addData, getDataById, getDataOfLang } from "../controllers/programmingLanguage/programmingLanguage.controller.js";
import {upload, uploadImagesMiddleware} from "../middleware/uploadMiddleware.js"

const router = Router();

router.route("/getData").get(getDataOfLang);
router.route("/getData/:id").get(getDataById);
router.route("/addData/:folder").post(upload, uploadImagesMiddleware, addData);

export default router;