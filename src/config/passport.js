import axios from "axios";
import dotenv from "dotenv";
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
dotenv.config();
console.log("hello")

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  async (accessToken2, refreshToken, profile, done) => {
    try {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken2}` },
      });

      // Find the primary email address
      const primaryEmail = emailResponse.data.find(email => email.primary && email.verified);
      // Check if the user already exists in the database
      let user = await User.findOne({ githubId: profile.id });
      // console.log(user)
      if (!user) {
        // Create a new user if they don't exist
        // console.log(profile)
        user =await User.create({
          name: profile.displayName || profile.username,
          email:  primaryEmail ? primaryEmail.email : null,
          picture: profile.photos[0]?.value,
          githubId: profile._json.id
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
