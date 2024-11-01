import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  languageName: {
    type: String,
  },
  img: {
    type: String,
  },
  description: {
    type: String,
  },
  videoLink: [{
    img: {
      type: String,
      default: null
    },
    link: {
      type: String,
    }
  }],
  tags: [{
    type:String
  }],
  averageRating: {
    type: Number,
    default: null
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  rating: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    review: {
      type: String,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

export const Course = mongoose.model('Course', courseSchema);
