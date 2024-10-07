import { Interview } from "../../models/interview.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addInterviewDataset = asyncHandler(async (req, res) => {
  const { title, img, description, Link, tags, isFree } = req.body;
  const interviewData = await Interview.create({
    title,
    img,
    description,
    Link,
    tags,
    isFree,
  });
  return res.status(200).json({
    message: "data added",
    interviewData: interviewData,
  });
});

const getAllInterviewData = asyncHandler(async (req, res) => {
  try {
    const interview = await Interview.find({}).select(
      "-Link -tags -rating -reviews -__v -totalRatings -averageRating"
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
    if (!id) return res.status(404).json({ message: "Id not found." });
    try {
      const interviewData = await Interview.findById(id).select("-__v");
      if (!interviewData)
        return res.status(404).json({ message: "interview data not found" });
      return res.status(200).json({
        message: "data fetched successfully.",
        data: interviewData,
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
      if (!interviewData) return res.status(500).json({ message: "data not found" });
      let totalRating = interviewData.totalRatings;
  
      const existingRating = interviewData.rating.find(
        (r) => r.userId.toString() === userId.toString()
      );
  
      if (existingRating) {
        existingRating.rating = rating;
        existingRating.ratedAt = Date.now();
      } else {
        totalRating++;
        interviewData.rating.push({
          userId: userId,
          rating: rating,
        });
        interviewData.totalRatings = totalRating;
      }
  
      const data = await interviewData.save({ validateBeforeSave: false });
      const ratingData = {
        totalRatings: totalRating,
        id: id,
        userId: data.userId,
        rating: data.rating,
        ratedAt: data.ratedAt,
      };
      return res.status(200).json({
        message: "interviewData rated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "error while retriving data.",
      });
    }
  });

  const addReviewinterviewData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {userId, review} = req.body;

    if (!(id && userId && review))
        return res.status(500).json({ message: "some information is missing" });

    try{
        const interviewData = await Interview.findById(id);
        if (!interviewData) return res.status(500).json({ message: "data not found"});

        interviewData.reviews.push({
            userId: userId,
            review: review,
        });

        const data = await interviewData.save({validateBeforeSave: false});
        const reviewId = data.reviews[data.reviews.length - 1]._id;
        return res.status(200).json({
          "message" : "interviewData reviewed successfully",
          reviewId: reviewId
        });
    }catch(error){
        return res.status(500).json({
            "message" : "error while retriving data."
        })
    }
});

const deleteReviewInerviewData = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const { reviewId } = req.body;
  
    if(!(id && reviewId)) return res.status(404).json({"message" : "some information is missing."});
    try{
      const interviewData = await Interview.findById(id);
      if(!interviewData) return res.status(404).json({"message" : "data not found" });
      const data = interviewData.reviews.pull(reviewId);
      await interviewData.save({validateBeforeSave: false});
      return res.status(200).json({
        "message" : "review deleted successfully"
      })
    }catch(error){
      return res.status(500).json({
        "message" : "error while retriving data."
      })
    }
  });

  const getInterviewDataByTag = asyncHandler(async (req, res) => {
    const {tag} = req.body;
    if(!tag) return res.status(404).json({"message" : "some information is missing"});
  
    try{
      const interviewData = await Interview.find({tags: tag}).select("-assetLink -tags -averageRating -totalRatings -rating -reviews -__v")
      if(!interviewData) return res.status(404).json({"message" : "data not found"});
      if(interviewData.length === 0){
        return res.status(404).json({
          "message" : "data not found"
        });
      }else{
        return res.status(200).json({
          "message" : "interviewData found successfully",
          interviewData: interviewData
        })
      }
    }catch(error){
      return res.status(500).json({
        "message" : "error while fetching data"
      });
    }
  
  });

export { addInterviewDataset, addReviewinterviewData, deleteReviewInerviewData, getAllInterviewData, getInterviewDataByTag, getPerticularInterviewData, ratinginterviewData };

