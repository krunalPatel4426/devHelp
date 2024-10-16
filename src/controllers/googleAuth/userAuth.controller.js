import dotenv from "dotenv";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

dotenv.config();

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  if (!userData) {
    return res.status(400).json({
      message: "Data not found",
    });
  }
  const { name, email, email_verified, picture } = userData;

  const user = await User.findOne({ email });
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    // domain: ".onrender.com",
    // path: "/",
    maxAge: 24*60*60*1000,
  };
  console.log(user);
  if (!user) {
    const newUser = await User.create({
      name,
      email,
      isEmailVerified: email_verified,
      picture,
    });
    // console.log(newUser);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser
    );
    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User created successfully",
        user: newUser,
      });
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );
  console.log(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
  return res.status(200).json({
    message: "user data",
    user,
  });
});

export { loginUser };
