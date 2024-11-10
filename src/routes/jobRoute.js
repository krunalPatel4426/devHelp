import { Router } from "express";
import { upload, uploadImagesMiddleware } from "../middleware/uploadMiddleware.js";
import { addData, getDataById, getDataByTag, gettAllData } from "../controllers/job/job.controller.js";
const router = Router();

router.route("/addData/:folder").post(upload, uploadImagesMiddleware, addData);
router.route("/getAllData").get(gettAllData);
router.route("/getData/:id").get(getDataById);
router.route("/tag/:tag").get(getDataByTag);

export default router;