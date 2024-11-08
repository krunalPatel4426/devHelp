import { Router } from "express";
import { addCourse, addReview, deleteReview, getAllCourseData, getAllCourseDataWithoutId, getCourseByTag, getCourseData, rating } from "../controllers/course/course.controller.js";
import {upload, uploadImagesMiddleware} from "../middleware/uploadMiddleware.js"

const router = Router();

router.route("/getAllCourseData").get(getAllCourseData);
router.route("/getAllData").get(getAllCourseDataWithoutId);
router.route("/getCourseData/:id").get(getCourseData);
// router.route("/course/rating/:courseId").post(rating);
router.route("/rating/:courseId").post(rating);
router.route("/review/:courseId").post(addReview);
router.route("/delete-review/:courseId").post(deleteReview);
router.route("/tag").get(getCourseByTag);
router.route("/add-course/:folder").post(upload, uploadImagesMiddleware, addCourse);
export default router;