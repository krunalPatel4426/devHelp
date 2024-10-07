import { Router } from "express";
import { addInterviewDataset, addReviewinterviewData, deleteReviewInerviewData, getAllInterviewData, getInterviewDataByTag, getPerticularInterviewData, ratinginterviewData } from "../controllers/interview/interview.controller.js";

const router = Router();

router.route("/addData").post(addInterviewDataset);
router.route("/getAllData").get(getAllInterviewData);
router.route("/getData/:id").get(getPerticularInterviewData);
router.route("/rating/:id").post(ratinginterviewData);
router.route("/review/:id").post(addReviewinterviewData);
router.route("/deleteReview/:id").post(deleteReviewInerviewData);
router.route("/getDataByTag").get(getInterviewDataByTag);

export default router;