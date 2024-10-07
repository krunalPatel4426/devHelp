import dotenv from "dotenv";
import { Router } from "express";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // eslint-disable-line no-unused-vars

dotenv.config();

const router = Router();

router.route("/suggest-link/:userId").post(
  asyncHandler(async (req, res) => {
    const { courseLink, title, description, whyyousuggest } = req.body;
    const {userId} = req.params;
    if (!(courseLink && userId)) {
      return res.status(400).json({ message: "Course link is required" });
    }
    try {
      const { email, name } = await User.findById(userId);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_SMTP_USER,
          pass: process.env.MAILTRAP_SMTP_PASS,
        },
      });

      const mailOptions = {
        from: email,
        to: "noone040426@gmail.com",
        subject: `New Course Suggestion by ${name}`,
        text: `Title: ${title} \n\nDescription: ${description} \n\nA new course has been suggested: ${courseLink} \n\nwhy i suggest this : ${whyyousuggest}`,
      };
      // console.log("Hello")
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Course suggestion sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send suggestion" });
    }
  })
);


export default router;