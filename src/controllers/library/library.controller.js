import { Library } from "../../models/libraries.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addLibrary = asyncHandler(async (req, res) => {
  const {
    Librarytitle,
    img,
    description,
    libraryLink,
    tags,
    isFree,
    libType,
    focus,
  } = req.body;
  const library = await Library.create({
    Librarytitle,
    img,
    description,
    libraryLink,
    tags,
    isFree,
    libType,
    focus,
  });
  return res.status(200).json({
    success: true,
    message: "data added",
    data: library,
  });
});

const getAllLibraryData = asyncHandler(async (req, res) => {
  try {
    const libraries = await Library.find({}).select(
      "-libraryLink -reviews -__v -averageRating"
    );
    let data = [];
    libraries.forEach((each) => {
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
    return res.status(200).json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while retriving data from DB.",
      error,
    });
  }
});

const getPerticularyLibraryData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(500).json({ message: "library id not found" });

  try {
    const libraryData = await Library.findById(id).select("-__v");
    if (!libraryData)
      return res.status(400).json({ message: "library not found" });
    const data = {
      _id: libraryData._id,
      title: libraryData.Librarytitle,
      img: libraryData.img,
      description: libraryData.description,
      isFree: libraryData.isFree,
      libType: libraryData.libType,
      link: libraryData.libraryLink,
      tags: libraryData.tags,
      totalRatings: libraryData.totalRatings,
      rating: libraryData.rating,
      reviews: libraryData.reviews,
    };
    return res.status(200).json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const ratingLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  const { userId, rating } = req.body;

  if (!(libraryId && userId && rating))
    return res.status(500).json({ message: "some information is missing" });
  try {
    const library = await Library.findById(libraryId);
    if (!library) return res.status(500).json({ message: "data not found" });
    let totalRating = library.totalRatings;

    const existingRating = library.rating.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existingRating) {
      let oldRating = existingRating.rating;
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
      library.totalRatings = library.totalRatings - oldRating + rating;
    } else {
      library.totalRatings = library.totalRatings + rating;
      library.rating.push({
        userId: userId,
        rating: rating,
      });
    }
    const data = await library.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: data.totalRatings,
      rating: data.rating,
    };
    return res.status(200).json({
      message: "library rated succeffuly",
      ratingData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const addReviewLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  const { userId, review } = req.body;

  if (!(libraryId && userId && review))
    return res.status(500).json({ message: "some information is missing." });

  try {
    const library = await Library.findById(libraryId);
    if (!library) return res.status(500).json({ message: "data not found" });

    library.reviews.push({
      userId: userId,
      review: review,
    });
    const data = await library.save({ validateBeforeSave: false });
    const reviewId = data.reviews[data.reviews.length - 1]._id;
    return res.status(200).json({
      message: "library reviewed successfully.",
      reviewId: reviewId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const deleteReviewLibrary = asyncHandler(async (req, res) => {
  const { libraryId } = req.params;
  const { reviewId } = req.body;
  if (!(libraryId && reviewId))
    return res.status(500).json({ message: "some information is missing" });
  try {
    const library = await Library.findById(libraryId);
    if (!library) return res.status(500).json({ message: "data not found" });
    const data = library.reviews.pull(reviewId);
    await library.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const getLibraryByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  if (!tag) return res.status(500).json({ message: "tag is missing" });
  try {
    const tagKeywords = tag.split(" ").map((word) => word.trim());
    const tagQuery = {
      $and: tagKeywords.map((keyword) => ({
        $or: [
          { tags: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })),
    };
    const librariesByTag = await Library.find(tagQuery).select(
      "-libraryLink -averageRating -totalRatings -rating -reviews -__v"
    );
    if (!librariesByTag)
      return res.status(400).json({ message: "data not found" });
    if (librariesByTag.length === 0) {
      return res.status(400).json({
        message: "no data found.",
      });
    } else {
      let data = [];
      librariesByTag.forEach((each) => {
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
      return res.status(200).json({
        message: "data fetched successfully.",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

export {
  addLibrary,
  addReviewLibrary,
  deleteReviewLibrary,
  getAllLibraryData,
  getLibraryByTag,
  getPerticularyLibraryData,
  ratingLibrary,
};
