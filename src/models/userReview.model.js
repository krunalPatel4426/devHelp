import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userReviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User reference
    ref: "User",
    required: true,
  },
  reviewAt: {
    type: Date,
    default: Date.now, // Automatically set the review date
  },
  reviewText: {
    type: String, // The actual text of the review
    required: true,
  },
  helpfulness: {
    type: Number, // Helpfulness rating from 0 to 5
    min: 0,
    max: 5,
    default: 0,
  },
  uiUxReview: {
    type: Number, // UI/UX review rating from 0 to 5
    min: 0,
    max: 5,
    default: 0,
  },
  resources: {
    type: Number, // Resources review rating from 0 to 5
    min: 0,
    max: 5,
    default: 0,
  },
  totalRating: {
    type: Number, // Overall rating from 0 to 5
    min: 0,
    max: 5,
    default: 0,
  },
  suggestionsToImproveWeb: {
    type: String, // Suggestions to improve the web experience
    default: "",
  },
});

export const UserReview = mongoose.model("UserReview", userReviewSchema);
