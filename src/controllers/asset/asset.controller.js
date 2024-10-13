import { Asset } from "../../models/asset.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addAsset = asyncHandler(async (req, res) => {
  const { assetName, img, description, assetLink, tags, isFree, focus } = req.body;
  const asset = await Asset.create({
    assetName,
    img,
    description,
    assetLink,
    tags,
    isFree,
    focus,
  });
  return res.status(200).json({
    message: "data added",
    asset: asset,
  });
});

const getAllAssetData = asyncHandler(async (req, res) => {
  try {
    const assets = await Asset.find({}).select(
      "-assetLink -tags -rating -reviews -__v -totalRatings -averageRating"
    );
    return res.status(200).json({
      message: "data fetched successfully",
      assets: assets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const getPerticularAssetData = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  if (!assetId) return res.status(400).json({ message: "asset Id not found." });
  try {
    const assetData = await Asset.findById(assetId).select("-__v");
    if (!assetData)
      return res.status(400).json({ message: "asset data not found" });
    return res.status(200).json({
      message: "data fetched successfully.",
      data: assetData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

const ratingAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const { userId, rating } = req.body;
  if (!(assetId && userId && rating))
    return res.status(400).json({ message: "some information is missing" });

  try {
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(500).json({ message: "data not found" });
    let totalRating = asset.totalRatings;

    const existingRating = asset.rating.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.ratedAt = Date.now();
    } else {
      totalRating++;
      asset.rating.push({
        userId: userId,
        rating: rating,
      });
      asset.totalRatings = totalRating;
    }

    const data = await asset.save({ validateBeforeSave: false });
    const ratingData = {
      totalRatings: totalRating,
      assetId: assetId,
      userId: data.userId,
      rating: data.rating,
      ratedAt: data.ratedAt,
    };
    return res.status(200).json({
      message: "asset rated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data.",
    });
  }
});

const addReviewAsset = asyncHandler(async (req, res) => {
    const { assetId } = req.params;
    const {userId, review} = req.body;

    if (!(assetId && userId && review))
        return res.status(400).json({ message: "some information is missing" });

    try{
        const asset = await Asset.findById(assetId);
        if (!asset) return res.status(400).json({ message: "data not found"});

        asset.reviews.push({
            userId: userId,
            review: review,
        });

        const data = await asset.save({validateBeforeSave: false});
        const reviewId = data.reviews[data.reviews.length - 1]._id;
        return res.status(200).json({
          "message" : "asset reviewed successfully",
          reviewId: reviewId
        });
    }catch(error){
        return res.status(500).json({
            "message" : "error while retriving data."
        })
    }
});

const deleteReviewAsset = asyncHandler(async (req, res) => {
  const {assetId} = req.params;
  const { reviewId } = req.body;

  if(!(assetId && reviewId)) return res.status(400).json({"message" : "some information is missing."});
  try{
    const asset = await Asset.findById(assetId);
    if(!asset) return res.status(400).json({"message" : "data not found" });
    const data = asset.reviews.pull(reviewId);
    await asset.save({validateBeforeSave: false});
    return res.status(200).json({
      "message" : "review deleted successfully"
    })
  }catch(error){
    return res.status(500).json({
      "message" : "error while retriving data."
    })
  }
});

const getAssetByTag = asyncHandler(async (req, res) => {
  const {tag} = req.body;
  if(!tag) return res.status(400).json({"message" : "some information is missing"});

  try{
    const assets = await Asset.find({tags: tag}).select("-assetLink -tags -averageRating -totalRatings -rating -reviews -__v")
    if(!assets) return res.status(400).json({"message" : "data not found"});
    if(assets.length === 0){
      return res.status(400).json({
        "message" : "data not found"
      });
    }else{
      return res.status(200).json({
        "message" : "assets found successfully",
        assets: assets
      })
    }
  }catch(error){
    return res.status(500).json({
      "message" : "error while fetching data"
    });
  }

});

export { addAsset, addReviewAsset, deleteReviewAsset, getAllAssetData, getAssetByTag, getPerticularAssetData, ratingAsset };

