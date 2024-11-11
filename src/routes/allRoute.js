import { Router } from "express";
import { getDataById, getDataByTag, getTotalBookmarks } from "../controllers/all/all.controller.js";

const router = Router();

router.route("/getData/:tag").get(getDataByTag);
router.route("/getDataById/:id").get(getDataById);
router.route("/getTotalBookmarks/:userId").get(getTotalBookmarks);

export default router;