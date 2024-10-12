import { Router } from "express";
import passport from "passport";
import { githubLogin } from "../controllers/github oauth2/github.controller.js";
const router = Router();

router.route("/github/login").get(passport.authenticate('github', {scope: ['user:email']}));
router.route("/github/callback").get(passport.authenticate('github'), githubLogin);


export default router;