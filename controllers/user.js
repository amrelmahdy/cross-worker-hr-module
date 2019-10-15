const User = require("./../models/user");
const {validationResult} = require('express-validator');
const {uploadImage} = require("./../helpers/file");

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const users = await User.find({role: 0}).populate("manager");
            // res.json(users);
            res.render("users", {
                users: users,
                is_data_table: true
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        const users = await User.find({role: 0 });
        try {
            res.render("users/create",  {
                users: users,
            });
        } catch (error) {
            next(error);
        }
    },
    save: async (req, res, next) => {
        try {

            // Finds the validation errors in this request and wraps them in an object with handy functions
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.render("users/create", {
                    errors: validationErrors.array(),
                });
            }
            const newUser = User(req.body);
            // handle already exists user ..
            const foundUser = await User.findOne({email: newUser.email});

            if (foundUser) {
                req.flash("error_msg", "User has already been taken");
                res.redirect("/users/create");
            } else {

                if(req.body.manager){
                   newUser.manager = await User.findOne({ _id:  req.body.manager});
                }
                // save s a new user
                User.saveUser(newUser, (err, user) => {

                    console.log(req.files);

                    if (req.files && req.files.image) {
                        const file = req.files.image;
                        uploadImage(file, "./public/images/uploads/", req).then(async (res) => {


                            await User.findOneAndUpdate({_id: user.id}, {
                                ...req.body,
                                image: res.image
                            });
                        }).catch(err => {
                            req.flash("success_msg", "Error uploading image.");
                            console.log(err);
                        });
                    }
                    req.flash("success_msg", "User created successfully");
                    res.redirect("/users");
                });
            }
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const {id} = req.params;
            const users = await User.find({role: 0 });
            const user = await User.findOne({_id: id}).populate("manager");
            res.render("users/edit", {
                users: users,
                bodyHolder: user,
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {

        const users = await User.find({role: 0 });

        try {

            const id = req.params.id;
            const oldUser = await User.findOne({_id: id}).populate("manager");

            let bodyHolder = {
                _id: oldUser._id,
                image: oldUser.image,
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                department: req.body.department,
                manager: oldUser.manager,
            };


            // Finds the validation errors in this request and wraps them in an object with handy functions
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.render("users/edit", {
                    errors: validationErrors.array(),
                    bodyHolder,
                    users
                });
            }

            if (req.body.email !== oldUser.email) {
                // find if email already exists
                const foundUser = await User.findOne({email: req.body.email});
                if (foundUser) {
                    req.flash("error_msg", "Work email has already been taken");
                    res.render("users/edit", {
                        bodyHolder,
                    });
                }
            }

            if(req.body.manager){
                req.body.manager = await User.findOne({ _id:  req.body.manager});
            }


            await User.findOneAndUpdate({_id: id}, req.body);
            if (req.files && req.files.image) {
                const file = req.files.image;
                uploadImage(file, "./public/images/uploads/", req).then(async (res) => {

                 await User.findOneAndUpdate({_id: id}, {
                        ...req.body,
                        image: res.image
                    });
                }).catch(err => {
                    req.flash("success_msg", "Error uploading image.");
                    console.log(err);
                });
            }

            req.flash("success_msg", "User updated successfully");
            res.redirect("/users");
        } catch (error) {
            next(error);
        }
    }
};