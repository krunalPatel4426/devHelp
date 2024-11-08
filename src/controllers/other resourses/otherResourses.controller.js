import { OtherResource } from "../../models/otherResourses.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addData = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data)
    return res.status(401).json({ success: false, message: "Body is empty" });

  try {
    const otherRes = await OtherResource.create(data);
    if (!otherRes)
      return res
        .status(500)
        .json({ success: false, error: "Error while saving data" });
    return res
      .status(200)
      .json({ success: true, message: "Data added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error while saving data" });
  }
});

const getAllData = asyncHandler(async (req, res) => {
  try {
    const data = await OtherResource.find({}).select(
      "-averageRating -videoLink -__v -reviews"
    );
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });

    return res
      .status(200)
      .json({ success: true, message: "data found.", otherResource:data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error from our side." });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(401).json({ success: false, error: "Id not found." });
  try {
    const resData = await OtherResource.findById(id).select("-__v");
    const data = {
      _id: resData._id,
      title: resData.resourceName,
      img: resData.img,
      description: resData.description,
      link: resData.resourceLink,
      tags: resData.tags,
      isFree: resData.isFree,
      totalRatings: resData.totalRatings,
      rating: resData.rating,
      reviews: resData.reviews,
    };
    return res.status(200).json({
      message: "data fetched successfully.",
      otherResource: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const getDataBytag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag)
    return res.status(400).json({ message: "some information is missing" });
  try {
    const res = await OtherResource.find({ tags: tag }).select(
      "-resourceLink -tags -averageRating -totalRatings -rating -reviews -__v"
    );
    if (!res) return res.status(400).json({ message: "data not found" });
    if (res.length === 0) {
      return res.status(400).json({
        message: "data not found",
      });
    } else {
      let data = [];
      res.forEach((each) => {
        data.push({
          _id: each._id,
          title: each.resourceName,
          img: each.img,
          description: each.description,
          isFree: each.isFree,
          tags: each.tags,
          totalRatings: each.totalRatings,
          rating: each.rating,
        });
      });
      console.log(data);
      return res.status(200).json({
        message: "assets found successfully",
        otherResource: data,
      });
    }
  } catch (error) {}
});

export { addData, getAllData, getDataById, getDataBytag };
