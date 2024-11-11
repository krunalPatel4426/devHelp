import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // console.log(accessToken);
    // console.log(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const githubLogin = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(req.user._id);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    maxAge: 24*60*60*1000,
  };
  console.log(accessToken, refreshToken)
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
  return res.redirect("https://github-o-auth-2-test.vercel.app/profile");
  // return res.redirect("http://localhost:5173/profile")
  // return res.status(200).json({ message: "data got", user: req.user });
});

export { githubLogin };
