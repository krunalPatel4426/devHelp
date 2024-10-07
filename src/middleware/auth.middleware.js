import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserData = asyncHandler(async (req, res, next)=>{
    const userCredential = req.body;
    const token = userCredential.credential;
    // console.log(userCredential.credential);
    // console.log(token)
    const userData = jwtDecode(token);
    req.body = userData;
    next();
})

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?.id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      );
  
      if (!user) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      req.user = user;
  
      next();
    } catch (error) {
      throw new ApiError(401, "Unauthorized request");
    }
  });
  
  /**
   *
   * @description Middleware to check logged in users for unprotected routes. The function will set the logged in user to the request object and, if no user is logged in, it will silently fail.
   *
   * `NOTE: THIS MIDDLEWARE IS ONLY TO BE USED FOR UNPROTECTED ROUTES IN WHICH THE LOGGED IN USER'S INFORMATION IS NEEDED`
   * */
  
  export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
  
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      );
      req.user = user;
      next();
    } catch (error) {
      next();
    }
  });