import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      // // required: true,
      // unique: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    githubId:{
      type: String
    },
    picture: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    password: {
        type: String,
        default: null
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    bookmarkedCourse: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    bookmarkedLibrary: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library'
    }],
    bookmarkedAsstes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    }],
    bookmarkedInterviewDataset: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview'
    }],
    // Array to track courses the user has rated/reviewed
    reviewedCourses: [{
      reviewId: {
        type: mongoose.Schema.Types.ObjectId,  // Shared review ID
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      reviewedAt: {
        type: Date,
        default: Date.now
      }
    }]
  });

  userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            name: this.name,
            githubId: this.githubId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
      .createHash("sha256")
      .update(unHashedToken)
      .digest("hex");

  const token_expiry = Date.now() + (20*60*1000);
  return {unHashedToken, hashedToken, token_expiry};
};

export const User = mongoose.model("User", userSchema);