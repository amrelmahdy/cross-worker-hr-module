module.exports = {
    showLoginPage: (req, res, next) => {
        try {

            if(req.isAuthenticated()){
                res.redirect(req.query && req.query.origin ? req.query.origin : "/");
            } else {
                res.render('login', {layout: 'login'});
            }

        } catch (error) {
            next(error);
        }
    },
};