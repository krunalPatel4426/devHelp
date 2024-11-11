import { Course } from "../../models/course.model.js";
import { Asset } from "../../models/asset.model.js";
import { Hackathon } from "../../models/hackathone.model.js";
import { Interview } from "../../models/interview.model.js";
import { Library } from "../../models/libraries.model.js";
import { OtherResource } from "../../models/otherResourses.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { Job } from "../../models/job.model.js";

const getDataByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag) {
    return res.status(400).json({ message: "Some information is missing" });
  }

  try {
    const tagRegex = new RegExp(tag, "i");

    // Query each collection for matching tags
    const [
      courses,
      assets,
      hackathons,
      interviews,
      libraries,
      otherResources,
      job,
    ] = await Promise.all([
      Course.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-videoLink -averageRating -totalRatings -rating -reviews -__v"
      ),

      Asset.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-assetLink -averageRating -totalRatings -rating -reviews -__v"
      ),

      Hackathon.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-hackathonLink -averageRating -totalRatings -rating -reviews -__v"
      ),

      Interview.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select("-Link -averageRating -totalRatings -rating -reviews -__v"),

      Library.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-libraryLink -averageRating -totalRatings -rating -reviews -__v"
      ),

      OtherResource.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-resourceLink -averageRating -totalRatings -rating -reviews -__v"
      ),
      Job.find({
        $or: [
          { tags: { $regex: tagRegex } },
          { description: { $regex: tagRegex } },
        ],
      }).select(
        "-jobLink -averageRating -totalRatings -rating -reviews -__v"
      ),
    ]);

    // Format data to match the required structure
    const formatData = (items, titleField) =>
      items.map((each) => ({
        _id: each._id,
        title: each[titleField] || each.title || "No Title", // Use titleField or default to "title"
        img: each.img || null,
        description: each.description || "",
        isFree: each.isFree || false,
        tags: each.tags || [],
        totalRatings: each.totalRatings || 0,
        rating: each.rating || 0,
      }));

    // Flatten and combine all formatted data into a single array
    const allData = [
      ...formatData(courses, "title"),
      ...formatData(assets, "assetName"),
      ...formatData(hackathons, "hackathonName"),
      ...formatData(interviews, "title"),
      ...formatData(libraries, "Librarytitle"),
      ...formatData(otherResources, "resourceName"),
      ...formatData(job, "jobTitle")
    ];

    if (allData.length === 0) {
      return res.status(400).json({ message: "Data not found" });
    }

    return res.status(200).json({
      message: "Assets found successfully",
      data: allData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching data" });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Some information is missing" });
  }

  try {
    // Query each collection for a single item by its id
    const [
      courses,
      assets,
      hackathons,
      interviews,
      libraries,
      otherResources,
      job,
    ] = await Promise.all([
      Course.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      Asset.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      Hackathon.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      Interview.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      Library.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      OtherResource.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
      Job.findById(id).select("-averageRating -totalRatings -rating -reviews -__v"),
    ]);

    // Function to format each data item
    const formatData = (item, titleField, linkField) => {
      if (!item) return null; // If no item found, return null

      return {
        _id: item._id,
        title: item[titleField] || item.title || "No Title", 
        img: item.img || null,
        description: item.description || "",
        isFree: item.isFree || false,
        tags: item.tags || [],
        totalRatings: item.totalRatings || 0,
        rating: item.rating || 0,
        link: item[linkField] || "",
      };
    };

    // Combine all formatted data into a single array
    const allData = [
      formatData(courses, "title", "videoLink"),
      formatData(assets, "assetName", "assetLink"),
      formatData(hackathons, "hackathonName", "hackathonLink"),
      formatData(interviews, "title", "Link"),
      formatData(libraries, "Librarytitle", "libraryLink"),
      formatData(otherResources, "resourceName", "resourceLink"),
      formatData(job, "jobTitle", "jobLink"),
    ].filter(item => item !== null); // Remove null values (if any)

    if (allData.length === 0) {
      return res.status(400).json({ message: "Data not found" });
    }

    return res.status(200).json({
      message: "Data found successfully",
      data: allData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching data" });
  }
});


const getTotalBookmarks = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const user = await User.findById(userId).select(
      "bookmarkedCourse bookmarkedLibrary bookmarkedAsstes bookmarkedInterviewDataset bookmarkedResourcesDataset bookmarkedHackathonDataset bookmarkedJob"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalBookmarks =
      user.bookmarkedCourse.length +
      user.bookmarkedLibrary.length +
      user.bookmarkedAsstes.length +
      user.bookmarkedInterviewDataset.length +
      user.bookmarkedResourcesDataset.length +
      user.bookmarkedHackathonDataset.length +
      user.bookmarkedJob.length;

    return res.status(200).json({
      message: "Total bookmarks retrieved successfully",
      totalBookmarks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching bookmarks" });
  }
});

export { getDataByTag, getTotalBookmarks, getDataById };
