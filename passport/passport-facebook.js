'use strict';

const passport = require('passport');
const User = require('../models/users');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//  SignUp Middleware
passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3022/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    // Check if user already exist
    User.findOne({facebook:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        } else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayname;
            newUser.email = profile._json.email;
            newUser.userimage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token: token});

            newUser.save((err) =>{
                return done(null, user);
            })
        }

        
    });
}));


