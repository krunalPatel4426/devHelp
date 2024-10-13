import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Asset } from "../../models/asset.model.js";
import { Interview } from "../../models/interview.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
dotenv.config();

const getminimalUserData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select(
      "-password -isEmailVerified -__v -refreshToken -reviewedCourses"
    );
    if (user) {
      return res.status(200).json({
        message: "user data fetch successfully.",
        user,
      });
    } else {
      return res.status(400).json({
        message: "user data not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error fetching user data.",
    });
  }
});

const bookmarkedCourse = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarkedCourse: courseId } },
      { new: true }
    );
    return res.status(200).json({
      message: "course bookmarked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error updating data.",
    });
  }
});

//remove book mark are left

const bookmarkedLibrary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { libraryId } = req.body;
  if (!(userId && libraryId))
    return res.status(400).json({ message: "some information is missing" });
  try {
    const user = await User.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedLibrary: libraryId },
    });
    return res.status(200).json({
      message: "library bookmarked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while updating data",
    });
  }
});

const bookmarkedAsset = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { assetId } = req.body;
  if (!(userId && assetId))
    return res.status(400).json({ message: "some information is missing" });
  try {
    const user = await Asset.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedAsset: assetId },
    });
    return res.status(200).json({
      message: "asset bookmarked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while updating data",
    });
  }
});

const bookmarkedInterviewDataset = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { id } = req.body;
  if (!(userId && id))
    return res.status(400).json({ message: "some information is missing" });
  try {
    const user = await Interview.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedAsset: id },
    });
    return res.status(200).json({
      message: "interviewDataset bookmarked successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while updating data",
    });
  }
});

const isUserLoggedIn = asyncHandler(async (req, res) => {
  // console.log(req.cookies.accessToken)
  if(!req.cookies.accessToken){
    return res.status(200).json({"message" : "user is not logged in"});
  }
  const accessToken = req.cookies.accessToken;
  // console.log(accessToken);
  if (!accessToken) {
    return res
      .status(400)
      .json({ message: "user is not logged in", isLoggedIn: false });
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  req.user = decoded;
  // console.log(decoded);
  return res
    .status(200)
    .json({ message: "user is logged in", isLoggedIn: true, data: decoded });
});

const logout = asyncHandler(async (req, res) => {
  if(!req.cookies.accessToken){
    return res.status(400).json({"message" : "you are not logged in"})
  }
  const accessToken = req.cookies.accessToken;
  const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).
    json({"message" : "user logged out successfully", isLoggedIn: false});
});

//complete in future if needed it return reviews in which given perticular user given
// const getCourseDetails = asyncHandler(async (req, res) => {
//     const {userId, courseId} = req.params;
//     try{
//         const course = await Course.findById(courseId);
//         const user = await User.findById(userId).select("-password -isEmailVerified -__v -refreshToken -bookmarkedCourse -reviewedCourses");

//     }catch(error){
//         res.status(501).json({
//             "message" : "error fetching course details."
//         })
//     }
// });

export {
  bookmarkedAsset,
  bookmarkedCourse,
  bookmarkedInterviewDataset,
  bookmarkedLibrary,
  getminimalUserData,
  isUserLoggedIn,
  logout
};
