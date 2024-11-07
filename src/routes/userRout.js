import { Router } from "express";
import { loginUser } from "../controllers/googleAuth/userAuth.controller.js";
import { addBookmark, getminimalUserData, isUserLoggedIn, logout, removeBookmark } from "../controllers/user/user.controller.js";
import { getUserData } from "../middleware/auth.middleware.js";

const router = Router();

// router.route("/register").post(registerUser);
// router.route("/login").post(loginUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/verify-email/:verificationToken").get(verifyEmail);
// router.route("/forgot-password").post(forgotPasswordRequest);
// // router.route("/reset-password/:resetToken").post(resetForgottenPassword);
// router.route("/reset-password/:resetToken").post(resetForgottenPassword);
// router.route("/isloggedin").get(isLoggedIn);

// //secure routes

// router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/change-password").post(verifyJWT, changeCurrentPassword);
// router.route("/resend-email-verification").post(verifyJWT, resendEmailVerificationToken);
router.route("/login/google").post(getUserData, loginUser);
router.route("/is-looged-in").get(isUserLoggedIn);

router.route("/getUserData/:userId").get(getminimalUserData);
// router.route("/bookmark-course/:userId").post(bookmarkedCourse);
// router.route("/bookmark-library/:userId").post(bookmarkedLibrary);
// router.route("/bookmark-asset/:userId").post(bookmarkedAsset);
router.route("/bookmark").post(addBookmark);
router.route("/rm-bookmark").delete(removeBookmark);
router.route("/logout").get(logout);


export default router;