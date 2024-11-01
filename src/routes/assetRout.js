import { Router } from "express";
import { addAsset, addReviewAsset, deleteReviewAsset, getAllAssetData, getAssetByTag, getPerticularAssetData, ratingAsset } from "../controllers/asset/asset.controller.js";
import {upload, uploadImagesMiddleware} from "../middleware/uploadMiddleware.js"
const router = Router();


router.route("/addAsset/:folder").post(upload, uploadImagesMiddleware, addAsset);
router.route("/getAllAssetData").get(getAllAssetData);
router.route("/getAsset/:assetId").get(getPerticularAssetData);
router.route("/rateAsset/:assetId").post(ratingAsset);
router.route("/reviewAsset/:assetId").post(addReviewAsset);
router.route("/deleteReviewAsset/:assetId").post(deleteReviewAsset);
router.route("/getAssetByTag").get(getAssetByTag);

export default router;