import express from 'express';
import passport from 'passport';
import { getCurrentUser, githubAuthCallback } from '../controllers/githubAuth/githubAuth.controller.js';

const router = express.Router();

// Route to initiate GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Route for GitHub callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubAuthCallback);

// Route to get the current authenticated user
router.get('/me', getCurrentUser);

export default router;
