import mongoose from "mongoose";
const Schema = mongoose.Schema;
const interviewSchema = new Schema({
  title: {
    type: String,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
  },
  Link: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  isFree: {
    type: Boolean,
  },
  averageRating: {
    type: Number,
    default: null,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  rating: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      ratedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      review: {
        type: String,
        default: null,
      },
      reviewedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Interview = mongoose.model("Interview", interviewSchema);
