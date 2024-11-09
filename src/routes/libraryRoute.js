import { Router } from "express";
import { addLibrary, addReviewLibrary, deleteReviewLibrary, getAllLibraryData, getLibraryByTag, getPerticularyLibraryData, ratingLibrary } from "../controllers/library/library.controller.js";
import {upload, uploadImagesMiddleware} from "../middleware/uploadMiddleware.js"
const router = Router();

router.route("/addLibrary/:folder").post(upload, uploadImagesMiddleware, addLibrary);
router.route("/getAllLibraries").get(getAllLibraryData);
router.route("/getLibraryData/:id").get(getPerticularyLibraryData);
router.route("/rateLibrary/:libraryId").post(ratingLibrary);
router.route("/addReviewLibrary/:libraryId").post(addReviewLibrary);
router.route("/deleteReviewLibrary/:libraryId").post(deleteReviewLibrary);
router.route("/getLibraryByTag/:tag").get(getLibraryByTag);

export default router;