import { Course } from "../../models/course.model.js";
import { ProgrammingLanguage } from "../../models/programmingLanguage.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addCourse = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const course = await Course.create(data);
    // console.log("Helo")
    // console.log(course)
    console.log("hello");
    const programmingL = await ProgrammingLanguage.findOne({
      name: course.languageName,
    });
    programmingL.courses.push(course._id);
    await programmingL.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: "Course added successfully",
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding course",
    });
  }
});
const getAllCourseData = asyncHandler(async (req, res) => {
  try {
    const languageId = req.body.languageId;
    const lang = await ProgrammingLanguage.findById(languageId);
    const courses = await Course.find(
      { _id: { $in: lang.courses } },
      "-averageRating -videoLink -__v -reviews"
    );
    res.status(200).json({ message: "data fetch successfully", courses });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

const getAllCourseDataWithoutId = asyncHandler(async (req, res) => {
  try {
    const courses = await Course.find({}).select(
      "-averageRating -videoLink -__v -reviews"
    );
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "data not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Data found", courses: courses });
  } catch (error) {
    return res.status(500).json({ error: "Error from our side." });
  }
});
const getCourseData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id, "-__v -averageRating");
    const data = {
      _id: course._id,
      title: course.title,
      img: course.img,
      description: course.description,
      tags: course.tags,
      isFree: course.isFree,
      totalRatings: course.totalRatings,
      link: [course.videoLink[0].link],
      rating: course.rating,
      reviews: course.reviews
    };
    return res
      .status(200)
      .json({ message: "course data fetch successfully", course: data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const rating = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { userId, rating } = req.body;
  if (!(courseId && userId && rating))
    return res.status(500).json({ message: "some infromation is missing." });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(500).json({ message: "can not find data" });
    //If user Already Rated or not
    const existingRating = course.rating.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existingRating) {
      let oldRating = existingRating.rating;
      let newTotalRating = course.totalRatings - oldRating + rating;
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
      course.totalRatings = newTotalRating;
    } else {
      course.totalRatings = course.totalRatings + rating;
      course.rating.push({
        userId: userId,
        rating: rating,
      });
    }

    const data = await course.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: data.totalRatings,
      rating: data.rating,
    };
    return res.status(200).json({
      message: "rating added or updated",
      ratingData,
    });
  } catch (error) {
    console.log(error);
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
  const { tag } = req.params;
  if (!tag) return res.status(500).json({ message: "tag is missing" });
  try {
    const tagKeywords = tag.split(" ").map((word) => word.trim());
    const tagRegex = new RegExp(tagKeywords.join("|"), "i");
    const course = await Course.find({
      $or: [
        { tags: { $regex: tagRegex, $options: "i" } },
        { description: { $regex: tagRegex, $options: "i" } },
      ],
    }).select("-videoLink -averageRating -__v -reviews -rating");
    if (!course) return res.status(404).json({ message: "can not find data" });
    if (course.length === 0) {
      return res.status(400).json({
        message: "no data found.",
      });
    } else {
      return res.status(200).json({
        message: "data fetched successfully",
        data: course,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});

export {
  addCourse,
  addReview,
  deleteReview,
  getAllCourseData,
  getCourseByTag,
  getCourseData,
  rating,
  getAllCourseDataWithoutId,
};
