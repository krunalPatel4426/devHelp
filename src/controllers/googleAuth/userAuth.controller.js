import dotenv from "dotenv";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

dotenv.config();

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    console.log(accessToken);
    console.log(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // await ProgrammingLanguage.create({
  //    name: "Python",
  //   description: "A powerful language known for its simplicity and use in data science.",
  //   courses:["66fecfd873abc5a50ad1b465"]
  // });
  // await Course.create({
  //   title: "Python for Data Science",
  //   description: "Learn Python with a focus on data science applications.",
  //   videoLink: [
  //     "https://example.com/video5",
  //     "https://example.com/video6"
  //   ],
  //   averageRating: 4.8,
  //   totalRatings: 12,
  // });
  const userData = req.body;
  // console.log(userData);
  if (!userData) {
    return res.status(400).json({
      message: "Data not found",
    });
  }
  const { name, email, email_verified, picture } = userData;

  const user = await User.findOne({ email });
//   console.log(user);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };
  console.log(user);
  if (!user) {
    const newUser = await User.create({
      name,
      email,
      isEmailVerified: email_verified,
      picture,
    });
    console.log(newUser);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser
    );
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );
  console.log(user);
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
  return res.status(200).json({
    message: "user data",
    user
  });
});

export { loginUser };
