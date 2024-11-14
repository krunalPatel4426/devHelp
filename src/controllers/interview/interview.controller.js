import { Interview } from "../../models/interview.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addInterviewDataset = asyncHandler(async (req, res) => {
  const { title, img, description, Link, tags, isFree, focus } = req.body;
  const interviewData = await Interview.create({
    title,
    img,
    description,
    Link,
    tags,
    isFree,
    focus,
  });
  return res.status(200).json({
    sucess: true,
    message: "data added",
    interviewData: interviewData,
  });
});

const getAllInterviewData = asyncHandler(async (req, res) => {
  try {
    const interview = await Interview.find({}).select(
      "-Link -focus -reviews -__v -averageRating"
    );

    return res.status(200).json({
      message: "data fetched successfully",
      interview: interview,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const getPerticularInterviewData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id not found." });
  try {
    const interviewData = await Interview.findById(id).select(
      "-__v -averageRating -focus"
    );
    if (!interviewData)
      return res.status(400).json({ message: "interview data not found" });
    const data = {
      _id: interviewData._id,
      title: interviewData.title,
      img: interviewData.img,
      description: interviewData.description,
      link: interviewData.Link,
      isFree: interviewData.isFree,
      tags: interviewData.tags,
      totalRatings: interviewData.totalRatings,
      rating: interviewData.rating,
      reviews: interviewData.reviews
    };
    return res.status(200).json({
      message: "data fetched successfully.",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const ratinginterviewData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;
  if (!(id && userId && rating))
    return res.status(500).json({ message: "some information is missing" });

  try {
    const interviewData = await Interview.findById(id);
    if (!interviewData)
      return res.status(500).json({ message: "data not found" });

    const existingRating = interviewData.rating.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      let oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
      interviewData.totalRatings =
        interviewData.totalRatings - oldRating + rating;
    } else {
      interviewData.totalRatings = interviewData.totalRatings + rating;
      interviewData.rating.push({
        userId: userId,
        rating: rating,
      });
    }

    const data = await interviewData.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: data.totalRatings,
      rating: data.rating,
    };
    return res.status(200).json({
      message: "interviewData rated successfully.",
      ratingData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const addReviewinterviewData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, review } = req.body;

  if (!(id && userId && review))
    return res.status(500).json({ message: "some information is missing" });

  try {
    const interviewData = await Interview.findById(id);
    if (!interviewData)
      return res.status(500).json({ message: "data not found" });

    interviewData.reviews.push({
      userId: userId,
      review: review,
    });

    const data = await interviewData.save({ validateBeforeSave: false });
    const reviewId = data.reviews[data.reviews.length - 1]._id;
    return res.status(200).json({
      message: "interviewData reviewed successfully",
      reviewId: reviewId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const deleteReviewInerviewData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reviewId } = req.body;

  if (!(id && reviewId))
    return res.status(400).json({ message: "some information is missing." });
  try {
    const interviewData = await Interview.findById(id);
    if (!interviewData)
      return res.status(400).json({ message: "data not found" });
    const data = interviewData.reviews.pull(reviewId);
    await interviewData.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const getInterviewDataByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag)
    return res.status(400).json({ message: "some information is missing" });

  try {
    const tagKeywords = tag.split(" ").map((word) => word.trim());
    const tagRegex = new RegExp(tagKeywords.join("|"), "i");
    const interviewData = await Interview.find({
      $or: [
        { tags: { $regex: tagRegex, $options: "i" } },
        { description: { $regex: tagRegex, $options: "i" } },
      ],
    }).select("-Link -averageRating -totalRatings -rating -reviews -__v");
    if (!interviewData)
      return res.status(400).json({ message: "data not found" });
    if (interviewData.length === 0) {
      return res.status(400).json({
        message: "data not found",
      });
    } else {
      let data = [];
      interviewData.forEach((each) => {
        data.push({
          _id: each._id,
          title: each.title,
          img: each.img,
          description: each.description,
          isFree: each.isFree,
          tags: each.tags,
          totalRatings: each.totalRatings,
          rating: each.rating,
        });
      });
      return res.status(200).json({
        message: "interviewData found successfully",
        interviewData: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});

export {
  addInterviewDataset,
  addReviewinterviewData,
  deleteReviewInerviewData,
  getAllInterviewData,
  getInterviewDataByTag,
  getPerticularInterviewData,
  ratinginterviewData,
};
