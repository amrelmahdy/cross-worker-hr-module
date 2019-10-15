const User = require("./../models/user");
const Benefit = require("./../models/benefit");
const {validationResult} = require('express-validator');
const {uploadImage} = require("./../helpers/file");

module.exports = {
    index: (req, res, next) => {
        try {
            res.render('index');
        } catch (error) {
            next(error);
        }
    },

    editProfile: (req, res, next) => {
        try {
            res.render('profile/edit', { bodyHolder: req.user });
           console.log(req.user)
        } catch (error) {
            next(error);
        }
    },
    updateProfile: (req, res, next) => {

        try {

            const oldUser = req.user;

            let bodyHolder = {
                _id: oldUser._id,
                name: req.body.name,
                mobile: req.body.mobile,
                department: req.body.department,
            };


            // Finds the validation errors in this request and wraps them in an object with handy functions
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.render("benefits/edit", {
                    errors: validationErrors.array(),
                    bodyHolder,
                });
            }

            oldUser.name = req.body.name;
            oldUser.mobile = req.body.mobile;
            oldUser.department = req.body.department;
            oldUser.save();


            if (req.files && req.files.image) {
                const file = req.files.image;
                uploadImage(file, "./public/images/uploads/", req).then(async (res) => {
                    oldUser.image =  res.image;
                    oldUser.save();
                }).catch(err => {
                    req.flash("success_msg", "Error uploading image.");
                    console.log(err);
                });
            }

            req.flash("success_msg", "Profile updated successfully");
            res.redirect("/profile");
        } catch (error) {
            next(error);
        }
    },
    deleteItem: async (req, res) => {
        try {
            const {id, model} = req.body;
            switch (model) {
                case "user":
                    await User.findOneAndRemove({_id: id});
                    break;
                case "benefit":
                    await Benefit.findOneAndRemove({_id: id});
                    break;
                default:
                //
            }
            res.status(200).json({
                status: true
            })
        } catch (error) {
            res.status(500).json({
                status: false
            });
        }
    },


};