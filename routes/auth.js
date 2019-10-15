const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const authController = require("../controllers/auth");
const User = require("./../models/user");



// this authenticates using email and password
passport.use(new LocalStrategy((email, password, done)  => {
        User.getUserByEmail(email,  (err, user)  => {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: "Unknown User .."});
            }
            User.verifyPassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    return done(null, false, {message: "Invalid credentials !!"})
                }
                return done(null, user);
            })
        });
    }
));



passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    User.getUserById(id,  (err, user) => {
        done(err, user);
    });
});



router.get('/login', authController.showLoginPage);

router.post("/login", passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true
}), (req, res) => {
    res.redirect("/");
});


router.get("/logout", (req, res, next) => {
   req.logout();
   res.redirect("/auth/login");
});

module.exports = router;

