import { Router } from "express";
import { upload, uploadImagesMiddleware } from "../middleware/uploadMiddleware.js";
import { addData, getAllData, getDataById, getDataByTag } from "../controllers/hackathone/hackathone.controller.js";
const router = Router();

router.route("/addData/:folder").post(upload, uploadImagesMiddleware, addData);
router.route("/getAllData").get(getAllData);
router.route("/getData/:id").get(getDataById);
router.route("/getDataByTag/:tag").get(getDataByTag);

export default router;