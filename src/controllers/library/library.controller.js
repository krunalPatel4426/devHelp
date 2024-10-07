import { Library } from "../../models/libraries.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addLibrary = asyncHandler(async (req, res) => {
  const { Librarytitle, img, description, libraryLink, tags, isFree } =
    req.body;
  const library = await Library.create({
    Librarytitle,
    img,
    description,
    libraryLink,
    tags,
    isFree,
  });
  return res.status(200).json({
    message: "data added",
    data: library,
  });
});

const getAllLibraryData = asyncHandler(async (req, res) => {
  try {
    const libraries = await Library.find({}).select(
      "-libraryLink -tags -rating -reviews -__v -totalRatings -averageRating"
    );
    return res.status(200).json({
      message: "data fetched successfully",
      data: libraries,
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
      return res.status(404).json({ message: "library not found" });
    return res.status(200).json({
      message: "data fetched successfully",
      data: libraryData,
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
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
    } else {
      totalRating++;
      library.rating.push({
        userId: userId,
        rating: rating,
      });
      library.totalRatings = totalRating;
    }
    const data = await library.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: totalRating,
      libraryId: libraryId,
      userId: data.userId,
      rating: data.rating,
      ratedAt: data.ratedAt,
    };
    return res.status(200).json({
      message: "library rated succeffuly",
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
  const { tag } = req.body;
  if (!tag) return res.status(500).json({ message: "tag is missing" });
  try {
    const librariesByTag = await Library.find({ tags: tag }).select("-libraryLink -tags -averageRating -totalRatings -rating -reviews -__v");
    if (!librariesByTag)
      return res.status(404).json({ message: "data not found" });
    if (librariesByTag.length === 0) {
      return res.status(404).json({
        message: "no data found.",
      });
    } else {
      return res.status(200).json({
        message: "data fetched successfully.",
        libraries: librariesByTag,
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
    ratingLibrary
};

