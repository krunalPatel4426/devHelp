import { Router } from "express";
import { addReview, deleteReview, getAllCourseData, getCourseByTag, getCourseData, rating } from "../controllers/course/course.controller.js";

const router = Router();

router.route("/getAllCourseData").get(getAllCourseData);
router.route("/getCourseData/:id").get(getCourseData);
// router.route("/course/rating/:courseId").post(rating);
router.route("/rating/:courseId").post(rating);
router.route("/review/:courseId").post(addReview);
router.route("/delete-review/:courseId").post(deleteReview);
router.route("/tag").get(getCourseByTag);
export default router;