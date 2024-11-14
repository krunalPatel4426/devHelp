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
    // console.log(jobData)
    let data = [];
    jobData.forEach((each) => {
      data.push({
        _id: each._id,
        title: each.jobTitle,
        img: each.img,
        description: each.description,
        tags: each.tags,
        isFree: each.isFree,
        totalRatings: each.totalRatings,
      });
    });
    return res.status(200).json({ success: true, job: data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while our side." });
  }
});


const getAllBookmarkedData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, error: "Bad Request" });
  }

  try {
    const user = await User.findById(userId).select(
      "bookmarkedCourse bookmarkedLibrary bookmarkedAsstes bookmarkedInterviewDataset bookmarkedResourcesDataset bookmarkedHackathonDataset bookmarkedJob"
    );

    const [
      courses,
      libraries,
      assets,
      interviews,
      resources,
      hackathons,
      jobs
    ] = await Promise.all([
      Course.find({ _id: { $in: user.bookmarkedCourse } }).select("-videoLink -averageRating -__v -reviews -rating"),
      Library.find({ _id: { $in: user.bookmarkedLibrary } }).select("-libraryLink -averageRating -__v -reviews -rating"),
      Asset.find({ _id: { $in: user.bookmarkedAsstes } }).select("-assetLink -averageRating -__v -reviews -rating"),
      Interview.find({ _id: { $in: user.bookmarkedInterviewDataset } }).select("-Link -averageRating -__v -reviews -rating"),
      OtherResource.find({ _id: { $in: user.bookmarkedResourcesDataset } }).select("-resourceLink -averageRating -__v -reviews -rating"),
      Hackathon.find({ _id: { $in: user.bookmarkedHackathonDataset } }).select("-hackathonLink -averageRating -__v -reviews -rating"),
      Job.find({ _id: { $in: user.bookmarkedJob } }).select("-jobLink -averageRating -__v -reviews -rating")
    ]);

    const formatData = (items, titleField, type) =>
      items.map((each) => ({
        _id: each._id,
        title: each[titleField] || each.title || "No Title",
        img: each.img || null,
        description: each.description || "",
        isFree: each.isFree || false,
        tags: each.tags || [],
        totalRatings: each.totalRatings || 0,
        rating: each.rating || 0,
        type // Include the type for each item to distinguish between categories
      }));

    // Merge all datasets into a single array
    const allBookmarkedData = [
      ...formatData(courses, "title", "course"),
      ...formatData(libraries, "Librarytitle", "library"),
      ...formatData(assets, "assetName", "asset"),
      ...formatData(interviews, "title", "interview"),
      ...formatData(resources, "resourceName", "resource"),
      ...formatData(hackathons, "hackathonName", "hackathon"),
      ...formatData(jobs, "jobTitle", "job")
    ];

    return res.status(200).json({ success: true, data: allBookmarkedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

export {
  getBookmarkedCourseData,
  getBookmarkedLibraryData,
  getBookmarkedAssetData,
  getBookmarkedInterviewData,
  getBookmarkedResourceData,
  getBookmarkedHackthonData,
  getBookmarkedJobData,
  getAllBookmarkedData
};
