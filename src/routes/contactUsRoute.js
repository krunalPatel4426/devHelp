import dotenv from "dotenv";
import { Router } from "express";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();

const router = Router();

router.route("/contact-detail").post(asyncHandler(async (req, res) => {
    const { name, number, email, message } = req.body;
    if(!(name, email, message)) return res.status(404).json({"message" : "some data is missing"});
    try{
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
            text: `name: ${name} \n\n${number? `number: ${number}` : ``} \n\nmessage: ${message}`,
          };
    
          await transporter.sendMail(mailOptions);
          res.status(200).json({ message: "Course suggestion sent successfully" });
    }catch(error){
        return res.status(500).json({"message" : "error while sending mail."});
    }
}));

export default router;