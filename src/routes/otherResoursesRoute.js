import { Router } from "express";
import { upload, uploadImagesMiddleware } from "../middleware/uploadMiddleware.js";
import { addData, getAllData, getDataById } from "../controllers/other resourses/otherResourses.controller.js";

const router = Router();


router.route("/addRes/:folder").post(upload, uploadImagesMiddleware, addData);
router.route("/getAllData").get(getAllData);
router.route("/getData/:id").get(getDataById);

export default router;
