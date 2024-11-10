import { Router } from "express";
import { getBookmarkedAssetData, getBookmarkedCourseData, getBookmarkedHackthonData, getBookmarkedInterviewData, getBookmarkedJobData, getBookmarkedLibraryData, getBookmarkedResourceData } from "../controllers/bookmark/bookmark.controller.js";

const router = Router();

router.route("/course/:id").get(getBookmarkedCourseData);
router.route("/library/:id").get(getBookmarkedLibraryData);
router.route("/asset/:id").get(getBookmarkedAssetData);
router.route("/interview/:id").get(getBookmarkedInterviewData);
router.route("/resource/:id").get(getBookmarkedResourceData);
router.route("/hackathon/:id").get(getBookmarkedHackthonData);
router.route("/job/:id").get(getBookmarkedJobData);

export default router;