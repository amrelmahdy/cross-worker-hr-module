module.exports = {
    redirectIfAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error_msg", "Please Login First");
            res.redirect(`/auth/login?origin=${req.originalUrl}`);
        }
    },
    redirectIfNotAuthorized: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 0) {
                req.flash("error_msg", "You Are Not Authorized");
                res.redirect(`/auth/login`);
            } else {
                next();
            }

        } else {
            req.flash("error_msg", "please login first");
            res.redirect(`/auth/login?origin=${req.originalUrl}`);
        }
    },
    redirectIfNotUser: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 1) {
                req.flash("error_msg", "You Are Not Authorized");
                res.redirect(`/auth/login`);
            } else {
                next();
            }

        } else {
            req.flash("error_msg", "please login first");
            res.redirect(`/auth/login?origin=${req.originalUrl}`);
        }
    }
};