import { Job } from "../../models/job.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addData = asyncHandler(async (req, res) => {
  const data  = req.body;
  if (Object.entries(data).length === 0)
    return res.status(404).json({ success: false, error: "Body is empty" });
  try {
    const job = await Job.create(data);
    return res.status(200).json({ success: true, message: "Data added." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error from our side." });
  }
});

const gettAllData = asyncHandler(async (req, res) => {
  try {
    const jobData = await Job.find({}).select(
      "-jobLink -reviews -__v -averageRating"
    );

    let data = [];
    jobData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.jobTitle,
        img: each.img,
        description: each.description,
        isFree: each.isFree,
        tags: each.tags,
        totalRatings: each.totalRatings,
        rating: each.rating,
      });
    });
    return res.status(200).json({
      message: "data fetched successfully",
      job: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error from our side." });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, message: "Id not found." });
  try {
    const jobData = await Job.findById(id).select("-__v");
    if (!jobData)
      return res
        .status(400)
        .json({ success: false, message: "data not found" });

    const data = {
      _id: jobData._id,
      title: jobData.jobTitle,
      img: jobData.img,
      description: jobData.description,
      link: jobData.jobLink,
      tags: jobData.tags,
      isFree: jobData.isFree,
      totalRatings: jobData.totalRatings,
      rating: jobData.rating,
      reviews: jobData.reviews,
    };
    return res.status(200).json({
      success: true,
      message: "data fetched successfully.",
      job: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while retriving data",
    });
  }
});

const getDataByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag)
    return res.status(400).json({ message: "some information is missing" });
  try {
    const jobData = await Job.find({
      $or:[
        {tags: { $regex: tag, $options: "i" }},
        {description: {$regex: tag, $options:"i"}}
      ]
    }).select("-jobLink -averageRating -totalRatings -rating -reviews -__v");
    if (!jobData) return res.status(400).json({ message: "data not found" });
    if (jobData.length === 0) {
      return res.status(400).json({
        message: "data not found",
      });
    } else {
      let data = [];
      jobData.forEach((each) => {
        data.push({
          _id: each._id,
          title: each.jobTitle,
          img: each.img,
          description: each.description,
          isFree: each.isFree,
          tags: each.tags,
          totalRatings: each.totalRatings,
          rating: each.rating,
        });
      });
      return res.status(200).json({
        message: "assets found successfully",
        job: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});


export {addData, gettAllData, getDataById, getDataByTag};