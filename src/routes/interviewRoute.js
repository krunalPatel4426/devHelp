import { Router } from "express";
import { addInterviewDataset, addReviewinterviewData, deleteReviewInerviewData, getAllInterviewData, getInterviewDataByTag, getPerticularInterviewData, ratinginterviewData } from "../controllers/interview/interview.controller.js";
import {upload, uploadImagesMiddleware} from "../middleware/uploadMiddleware.js"
const router = Router();

router.route("/addData/:folder").post(upload, uploadImagesMiddleware, addInterviewDataset);
router.route("/getAllData").get(getAllInterviewData);
router.route("/getData/:id").get(getPerticularInterviewData);
router.route("/rating/:id").post(ratinginterviewData);
router.route("/review/:id").post(addReviewinterviewData);
router.route("/deleteReview/:id").post(deleteReviewInerviewData);
router.route("/getDataByTag/:tag").get(getInterviewDataByTag);

export default router;