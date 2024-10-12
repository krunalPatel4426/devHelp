import { Course } from "../../models/course.model.js";
import { ProgrammingLanguage } from "../../models/programmingLanguage.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const course = await Course.create(data);
    // console.log("Helo")
    // console.log(course)
    const programmingL = await ProgrammingLanguage.findOne({
      name: course.languageName,
    });
    programmingL.courses.push(course._id);
    await programmingL.save({ validateBeforeSave: false });
    res.status(200).json({
      message: "Course added successfully",
      course: course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding course",
    });
  }
});
const getAllCourseData = asyncHandler(async (req, res) => {
  try {
    const courseIds = req.body.courses;
    const courses = await Course.find(
      { _id: { $in: courseIds } },
      "-tags -averageRating -videoLink -__v -rating -reviews"
    );
    // console.log(courses);
    res.status(200).json({ message: "data fetch successfully", courses });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const getCourseData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id, "-__v -averageRating");
    console.log(course);
    return res
      .status(200)
      .json({ message: "course data fetch successfully", course });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const rating = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { userId, rating } = req.body;
  // console.log(userId, rating);
  if (!(courseId && userId && rating))
    return res.status(500).json({ message: "some infromation is missing." });

  try {
    const course = await Course.findById(courseId);
    let totalRating = course.totalRatings;
    // console.log(course);
    if (!course) return res.status(500).json({ message: "can not find data" });
    //If user Already Rated or not
    const existingRating = course.rating.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existingRating) {
      // console.log(existingRating)
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
      // await existingRating.save({validateBeforeSave: false});
    } else {
      // console.log(totalRating);
      totalRating++;
      course.rating.push({
        userId: userId,
        rating: rating,
      });
      course.totalRatings = totalRating;
    }

    const data = await course.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: totalRating,
      courseId: courseId,
      userId: data.userId,
      rating: data.rating,
      ratedAt: data.ratedAt,
    };
    return res.status(200).json({
      message: "rating added or updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
});

const addReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { userId, review } = req.body;

  if (!(courseId && userId && review))
    return res.status(500).json({ message: "some information is missing." });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(500).json({ message: "can not find data" });
    course.reviews.push({
      userId: userId,
      review: review,
    });
    const data = await course.save({ validateBeforeSave: false });
    const reviewId = data.reviews[data.reviews.length - 1]._id;
    return res.status(200).json({
      message: "review added successfully.",
      reviewId: reviewId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { reviewId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(500).json({ message: "can not find data" });
    const data = course.reviews.pull(reviewId);
    await course.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});

const getCourseByTag = asyncHandler(async (req, res) => {
  const { tag } = req.body;
  if (!tag) return res.status(500).json({ message: "tag is missing" });
  try {
    const course = await Course.find({ tags: tag }).select(
      "-videoLink -averageRating -__v -tags -reviews -rating"
    );
    if (!course) return res.status(404).json({ message: "can not find data" });
    if (course.length === 0) {
      return res.status(400).json({
        message: "no data found.",
      });
    } else {
      return res.status(200).json({
        message: "data fetched successfully",
        course,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});

export {
  addCourse, addReview,
  deleteReview,
  getAllCourseData,
  getCourseByTag,
  getCourseData,
  rating
};

