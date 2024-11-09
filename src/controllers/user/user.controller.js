import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Asset } from "../../models/asset.model.js";
import { Interview } from "../../models/interview.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Course } from "./../../models/course.model.js";
import { Library } from "./../../models/libraries.model.js";
import { Hackathon } from "../../models/hackathone.model.js";
import { OtherResource } from "../../models/otherResourses.model.js";

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


const models = {
  bookmarkedCourse: Course,
  bookmarkedLibrary: Library,
  bookmarkedAsstes: Asset,
  bookmarkedInterviewDataset: Interview,
  bookmarkedResourcesDataset:OtherResource,
  bookmarkedHackathonDataset:Hackathon
};

const addBookmark = asyncHandler(async (req, res) => {
  const { userId, id } = req.body;
  if (!(userId && id))
    return res.status(400).json({ message: "Some information is missing" });

  try {
    for (const [field, Model] of Object.entries(models)) {
      const data = await Model.findById(id);
      if (data) {
        const user = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { [field]: id } },
          { new: true }
        );
        if (user) return res.status(200).json({ message: "Bookmarked Successfully" });
      }
    }
    return res.status(404).json({ error: "Data not found" });
  } catch (error) {
    res.status(500).json({ error: "Error from our side." });
  }
});

//remove book mark are left


const removeBookmark = asyncHandler(async (req, res) => {
  const { userId, id } = req.body;

  if (!userId || !id) {
    return res.status(400).json({ message: "User ID and item ID are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // List of bookmark fields to check
    const bookmarkFields = [
      'bookmarkedCourse',
      'bookmarkedLibrary',
      'bookmarkedAsstes',
      'bookmarkedInterviewDataset',
      'bookmarkedResourcesDataset',
      'bookmarkedHackathonDataset'
    ];

    let bookmarkRemoved = false;

    // Loop through each bookmark field and try to remove the ID
    for (const field of bookmarkFields) {
      // Check if the field exists and is an array
      if (Array.isArray(user[field])) {
        const index = user[field].indexOf(id);
        if (index !== -1) {
          user[field].splice(index, 1);  // Remove the bookmark
          bookmarkRemoved = true;
          break;
        }
      }
    }

    if (!bookmarkRemoved) {
      return res.status(404).json({ message: "Bookmark not found in any category" });
    }

    await user.save();
    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing bookmark", error: error.message });
  }
});


const getBookmarkData = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Retrieve the user's bookmarked items by ID
    const user = await User.findById(userId).select(
      "bookmarkedCourse bookmarkedLibrary bookmarkedAsstes bookmarkedInterviewDataset bookmarkedHackathonDataset bookmarkedResourcesDataset"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Combine all bookmarked IDs into one array
    const allBookmarks = [
      ...user.bookmarkedCourse,
      ...user.bookmarkedLibrary,
      ...user.bookmarkedAsstes,
      ...user.bookmarkedInterviewDataset,
    ];

    return res.status(200).json({message:"success", bookmarks: allBookmarks });
  } catch (error) {
    return res.status(500).json({ error: "Error from our side." });
  }
});

const isUserLoggedIn = asyncHandler(async (req, res) => {
  // console.log(req.cookies.accessToken)
  if (!req.cookies.accessToken) {
    return res.status(200).json({ message: "user is not logged in" });
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
  if (!req.cookies.accessToken) {
    return res.status(400).json({ message: "you are not logged in" });
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
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "user logged out successfully", isLoggedIn: false });
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
  getBookmarkData,
  getminimalUserData,
  isUserLoggedIn,
  logout,
  addBookmark,
  removeBookmark
};
