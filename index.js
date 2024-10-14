import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import "./src/config/passport.js";
import connectDb from "./src/db/index.js";
import morganMiddleware from "./src/logger/morgan.logger.js";
import assetRouter from "./src/routes/assetRout.js";
import contactUsRoute from "./src/routes/contactUsRoute.js";
import courseRoute from "./src/routes/courseRoute.js";
import githubAuth from "./src/routes/githubAuthRoute.js";
import interviewRoute from "./src/routes/interviewRoute.js";
import libraryRoute from "./src/routes/libraryRoute.js";
import programmingRoute from "./src/routes/programmingLanguageRoute.js";
import userReviewRoute from "./src/routes/userReviewRoute.js";
import userRouter from "./src/routes/userRout.js";
import userSuggetionRoute from "./src/routes/userSuggestionRoute.js";
import { ApiError } from "./src/utils/ApiError.js";
import { ApiResponse } from "./src/utils/ApiResponse.js";

const app = express();
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT;
connectDb();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// change corse origin * is only for devlopment
const allowedOrigins = ["http://localhost:5173", "https://devhelpp.vercel.app"];
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in the allowedOrigins array or is undefined (for same-origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and other credentials if needed
};
// Use the CORS middleware with the defined options
app.use(cors(corsOptions));
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(limiter);
console.log("Hllo");
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
app.use(morganMiddleware);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", githubAuth);
app.use("/user", userRouter);
app.use("/programmingLanguage", programmingRoute);
app.use("/course", courseRoute);
app.use("/library", libraryRoute); // library route
app.use("/asset", assetRouter);
app.use("/interview", interviewRoute);
app.use("/suggestion", userSuggetionRoute);
app.use("/review", userReviewRoute); // review route
app.use("/contact-us", contactUsRoute);
app.get("/", (req, res) => {
  try {
    // console.log("Hello");
    res.send(new ApiResponse("Error 404 Page not found", 404));
    // res.send("Hello")
  } catch (Error) {
    throw new ApiError(500, "server Connection failed");
  }
});

app.listen(port, () => {
  console.log(`Example app listenng on port ${port}`);
});
