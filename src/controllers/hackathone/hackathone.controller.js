import { Hackathon } from "../../models/hackathone.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addData = asyncHandler(async (req, res) => {
  const data = req.body;
  // console.log(data);
  if (Object.entries(data).length === 0) {
    return res
      .status(404)
      .json({ success: false, error: "Body data not found." });
  }
  try {
    const hack = await Hackathon.create(data);
    return res.status(200).json({ success: true, message: "data added." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error from our side" });
  }
});

const getAllData = asyncHandler(async (req, res) => {
  try {
    const hackData = await Hackathon.find({}).select(
      "-hackathonLink -reviews -__v -averageRating"
    );
    if (hackData.length === 0) {
      return res.status(404).json({ success: false, error: "Data not found" });
    }
    let data = [];
    hackData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.hackathonName,
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
      hackathon: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id not found." });
  try {
    const hackData = await Hackathon.findById(id).select("-__v");
    if (!hackData) return res.status(400).json({ message: "data not found" });

    const data = {
      _id: hackData._id,
      title: hackData.hackathonName,
      img: hackData.img,
      description: hackData.description,
      link: hackData.hackathonLink,
      tags: hackData.tags,
      isFree: hackData.isFree,
      totalRatings: hackData.totalRatings,
      rating: hackData.rating,
      reviews: hackData.reviews,
    };
    return res.status(200).json({
      message: "data fetched successfully.",
      hackathon: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const getDataByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag)
    return res.status(400).json({ message: "some information is missing" });

  try {
    const hackData = await Hackathon.find({
      $or: [
        { tags: { $regex: tag, $options: "i" } },
        { description: { $regex: tag, $options: "i" } },
      ],
    }).select(
      "-hackathonLink -tags -averageRating -totalRatings -rating -reviews -__v"
    );
    if (!hackData) return res.status(400).json({ message: "data not found" });
    if (hackData.length === 0) {
      return res.status(400).json({
        message: "data not found",
      });
    } else {
      let data = [];
      hackData.forEach((each) => {
        data.push({
          _id: each._id,
          title: each.hackathonName,
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
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching data",
    });
  }
});

export { addData, getAllData, getDataById, getDataByTag };
