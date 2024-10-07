import { Router } from "express";
import { UserReview } from "../models/userReview.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/user-review/:userId").post(asyncHandler(async (req, res) => {
    const {userId} = req.params;
    const {reviewText, helpfulness, uiUxReview, resources, totalRating, suggestionsToImproveWeb} = req.body;
    try{
        const userReview = await UserReview.create({
            userId,
            reviewText,
            helpfulness,
            uiUxReview,
            resources,
            totalRating,
            suggestionsToImproveWeb
        });
        if(!userReview) return res.status(500).json({"message" : "something went wrong"});
        res.status(201).json({
            "message" : "user reviewed successfully",
        });
    }catch(error){
        return res.status(500).json({
            "message" : "error from our side"
        });
    }
}));

export default router;