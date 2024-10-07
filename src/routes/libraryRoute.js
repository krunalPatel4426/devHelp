import { Router } from "express";
import { addLibrary, addReviewLibrary, deleteReviewLibrary, getAllLibraryData, getLibraryByTag, getPerticularyLibraryData, ratingLibrary } from "../controllers/library/library.controller.js";
const router = Router();

router.route("/addLibrary").post(addLibrary);
router.route("/getAllLibraries").get(getAllLibraryData);
router.route("/getLibraryData/:id").get(getPerticularyLibraryData);
router.route("/rateLibrary/:libraryId").post(ratingLibrary);
router.route("/addReviewLibrary/:libraryId").post(addReviewLibrary);
router.route("/deleteReviewLibrary/:libraryId").post(deleteReviewLibrary);
router.route("/getLibraryByTag").get(getLibraryByTag);

export default router;