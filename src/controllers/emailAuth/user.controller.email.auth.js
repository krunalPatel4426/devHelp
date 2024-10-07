import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "../../utils/mail.js";

dotenv.config();

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access token refresh token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, isEmployee, isNormalUser, isAdmin } =
    req.body;

  const exitesUser = await User.findOne({ $or: [{ username }, { email }] });

  if (exitesUser) {
    throw new ApiError(
      409,
      "user with email or username is already exits.",
      []
    );
  }

  const user = await User.create({
    email,
    username,
    password,
    isEmployee,
    isNormalUser,
    isAdmin,
    isEmailVerified: false,
  });

  /**
   * unHashedToken: unHashed token is something we will send to the user's mail
   * hashedToken: we will keep record of hashedToken to validate the unHashedToken in verify email controller
   * tokenExpiry: Expiry to be checked before validating the incoming token
   */

  const { unHashedToken, hashedToken, token_expiry } =
    user.generateTemporaryToken();

  /**
   * assign hashedToken and tokenExpiry in DB till user clicks on email verification link
   * The email verification is handled by {@link verifyEmail}
   */

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = token_expiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/user/verify-email/${unHashedToken}`
    ),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );
  if (!createUser) {
    throw new ApiError(500, "Something went wrong wile registering the user.");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createUser },
        "Users registered successfully and verification email has been sent on your email."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, username, password } = req.body;
  //check this letter condition and change it to and (&&)
  if (!email && !username) {
    throw new ApiError(400, "username or eamil required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // get the user document ignoring the password and refreshToken field

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "verification token is missing");
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // While registering the user, same time when we are sending the verification mail
  // we have saved a hashed value of the original email verification token in the db
  // We will try to find user with the hashed token generated by received token
  // If we find the user another check is if token expiry of that token is greater than current time if not that means it is expired

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid verification token");
  }

  // If we found the user that means the token is valid
  // Now we can remove the associated email token and expiry date as we no  longer need them
  // console.log(user);
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  res.redirect("http://localhost:3000/login");
  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, { isEmailVerified: true }, "Email Verified"));
});

// This controller is called when user is logged in and he has snackbar that your email is not verified
// In case he did not get the email or the email verification token is expired
// he will be able to resend the token while he is logged in

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // if email is already verified throw an error
  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const { unHashedToken, hashedToken, token_expiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = token_expiry;
  user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/user/verify-email/${unHashedToken}`
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your mail ID"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(400, "Invalid refreshToken");
    }

    // check if incoming refresh token is same as the refresh token attached in the user document
    // This shows that the refresh token is used or not
    // Once it is used, we are replacing it with new refresh token below

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, "Invalid refreshToken");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token and refresh token generated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Get email from the client and check if user exists
  if (!email) {
    throw new ApiError(400, "Email is required", []);
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  // Generate a temporary token
  const { unHashedToken, hashedToken, token_expiry } =
    user.generateTemporaryToken(user._id);

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = token_expiry;

  await user.save({ validateBeforeSave: false });

  // Send mail with the password reset link. It should be the link of the frontend url with token
  await sendEmail({
    email: user?.email,
    subject: "password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user?.username, // ! Frontend will send the below token with the new password in the request body to the backend reset password endpoint // ! NOTE: Following link should be the link of the frontend page responsible to request password reset
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Email sent successfully to reset password")
    );
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
  console.log("hello");
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // See if user with hash similar to resetToken exists
  // If yes then check if token expiry is greater than current date

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  // if everything is ok and token id valid
  // reset the forgot password token and expiry

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const isLoggedIn = asyncHandler(async (req, res) => {
  console.log(req.cookies.accessToken);
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, { isLoggedIn: false }, "You are not logged in")
      );
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  req.user = decoded;
  return res
    .status(200)
    .json(new ApiResponse(200, decoded, "You are logged in"));
});

const attendance = asyncHandler(async (req, res) => {
  const id = req.params;
  try {
    const attendanceData = await Attedance.find({ userId: id });
    res.status(200).json(new ApiResponse(200, attendanceData, ""));
  } catch (error) {
    res.status(500).json({ message: "Error while retriving attedance" });
  }
});

export {
  attendance,
  changeCurrentPassword,
  forgotPasswordRequest,
  isLoggedIn,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerificationToken,
  resetForgottenPassword,
  verifyEmail
};

