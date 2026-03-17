import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_GOOGLE_CALLBACK_URL
} from "./env.js";
import { User } from "../models/User.js";
import { sendWelcomeEmail } from "../services/emailService.js";

export const configurePassport = () => {
  // Temporarily disable Google OAuth if credentials not provided
  if (AUTH_GOOGLE_ID && AUTH_GOOGLE_SECRET && AUTH_GOOGLE_CALLBACK_URL) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: AUTH_GOOGLE_ID,
          clientSecret: AUTH_GOOGLE_SECRET,
          callbackURL: AUTH_GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const existing = await User.findOne({ googleId: profile.id });
            if (existing) return done(null, existing);

            const user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value
            });

            // Send welcome email for new Google users
            try {
              await sendWelcomeEmail(user.email, user);
            } catch (emailError) {
              console.error('Failed to send welcome email for Google user:', emailError);
              // Continue with authentication even if email fails
            }

            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  } else {
    console.log('Google OAuth credentials not provided - Google auth disabled');
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

