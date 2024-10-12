import dotenv from "dotenv";
import passport from "passport";
import githubStragy from "passport-github2";
import { User } from "../models/user.model.js";
dotenv.config();
const GithubStrategy = githubStragy.Strategy;

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user.githubId);
});
passport.deserializeUser((id, done) => {
  User.find({ githubId: id }).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = null;
        if (!profile._json.email) {
          // Fetch email addresses from GitHub's email API if necessary
          const emailsResponse = await fetch(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          );
          const emails = await emailsResponse.json();
          email = emails.find((e) => e.primary && e.verified).email;
        }
        // console.log("Email:", email)
        // console.log("profile", profile);
        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          done(null, user);
        } else {
          const userData = {
            name: profile._json.login,
            githubId: profile._json.id,
            picture: profile._json.avatar_url,
            email: email,
          };
          user = await User.create(userData);
          done(null, user);
        }
      } catch (error) {
        done(null, "error while from our side");
      }
    }
  )
);
