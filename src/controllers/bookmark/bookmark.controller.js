import { User } from "../../models/user.model.js";
import { Course } from "../../models/course.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Library } from "../../models/libraries.model.js";
import { Asset } from "../../models/asset.model.js";
import { Interview } from "../../models/interview.model.js";
import { OtherResource } from "../../models/otherResourses.model.js";
import { Hackathon } from "../../models/hackathone.model.js";
import { Job } from "../../models/job.model.js";

const getBookmarkedCourseData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select("bookmarkedCourse");
    console.log(bookmarkedIds);
    if (bookmarkedIds.bookmarkedCourse.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const courseData = await Course.find({
      _id: bookmarkedIds.bookmarkedCourse,
    }).select("-videoLink -averageRating -__v -reviews -rating");
    return res.status(200).json({ success: true, course: courseData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedLibraryData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select("bookmarkedLibrary");
    if (bookmarkedIds.bookmarkedLibrary.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const libData = await Library.find({
      _id: bookmarkedIds.bookmarkedLibrary,
    }).select("-libraryLink -averageRating -__v -reviews -rating");
    let data = [];
    libData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.Librarytitle,
        img: each.img,
        description: each.description,
        isFree: each.isFree,
        tags: each.tags,
        totalRatings: each.totalRatings,
        rating: each.rating,
      });
    });
    return res.status(200).json({ success: true, library: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedAssetData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select("bookmarkedAsstes");
    if (bookmarkedIds.bookmarkedAsstes.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const assetData = await Asset.find({
      _id: bookmarkedIds.bookmarkedAsstes,
    }).select("-assetLink -averageRating -__v -reviews -rating");
    let data = [];
    assetData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.assetName,
        img: each.img,
        description: each.description,
        isFree: each.isFree,
        tags: each.tags,
        totalRatings: each.totalRatings,
        rating: each.rating,
      });
    });
    return res.status(200).json({ success: true, asset: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedInterviewData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select(
      "bookmarkedInterviewDataset"
    );
    if (bookmarkedIds.bookmarkedInterviewDataset.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const interviewData = await Interview.find({
      _id: bookmarkedIds.bookmarkedInterviewDataset,
    }).select("-Link -averageRating -__v -reviews -rating");
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
    return res.status(200).json({ success: true, interview: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedResourceData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select(
      "bookmarkedResourcesDataset"
    );
    if (bookmarkedIds.bookmarkedResourcesDataset.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const resourceData = await OtherResource.find({
      _id: bookmarkedIds.bookmarkedResourcesDataset,
    }).select("-resourceLink -averageRating -__v -reviews -rating");
    let data = [];
    resourceData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.resourceName,
        img: each.img,
        description: each.description,
        isFree: each.isFree,
        tags: each.tags,
        totalRatings: each.totalRatings,
      });
    });
    return res.status(200).json({ success: true, resource: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedHackthonData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select(
      "bookmarkedHackathonDataset"
    );
    if (bookmarkedIds.bookmarkedHackathonDataset.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const hackathonData = await Hackathon.find({
      _id: bookmarkedIds.bookmarkedHackathonDataset,
    }).select("-hackathonLink -averageRating -__v -reviews -rating");
    let data = [];
    hackathonData.forEach((each) => {
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
    return res.status(200).json({ success: true, hackathon: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

const getBookmarkedJobData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, error: "Bad Request" });
  try {
    const bookmarkedIds = await User.findById(id).select("bookmarkedJob");
    if (bookmarkedIds.bookmarkedJob.length === 0)
      return res
        .status(404)
        .json({ success: true, message: "No Bookmark Available" });
    const jobData = await Job.find({
      _id: bookmarkedIds.bookmarkedJob,
    }).select("-jobLink -averageRating -__v -reviews -rating");
    let data = [];
    jobData.forEach((each) => {
      data.push({
        _id: jobData._id,
        title: jobData.jobTitle,
        img: jobData.img,
        description: jobData.description,
        tags: jobData.tags,
        isFree: jobData.isFree,
        totalRatings: jobData.totalRatings,
      });
    });
    return res.status(200).json({ success: true, job: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});

export {
  getBookmarkedCourseData,
  getBookmarkedLibraryData,
  getBookmarkedAssetData,
  getBookmarkedInterviewData,
  getBookmarkedResourceData,
  getBookmarkedHackthonData,
  getBookmarkedJobData
};
