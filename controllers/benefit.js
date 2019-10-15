const Benefit = require("./../models/benefit");
const {validationResult} = require('express-validator');
const {uploadImage} = require("./../helpers/file");

module.exports = {
    getAll: async (req, res, next) => {
        try {
            const benefits = await Benefit.find({});
            // res.json(users);
            res.render("benefits", {
                benefits,
                is_data_table: true
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            res.render("benefits/create");
        } catch (error) {
            next(error);
        }
    },
    save: async (req, res, next) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.render("benefits/create", {
                    errors: validationErrors.array(),
                });
            }
            const newBenefit = Benefit(req.body);
            await newBenefit.save();


            if (req.files && req.files.image) {
                const file = req.files.image;
                uploadImage(file, "./public/images/uploads/", req).then(async (res) => {
                    await Benefit.findOneAndUpdate({_id: newBenefit.id}, {
                        ...req.body,
                        image: res.image
                    });
                }).catch(err => {
                    req.flash("success_msg", "Error uploading image.");
                    console.log(err);
                });
            }
            req.flash("success_msg", "User created successfully");
            res.redirect("/benefits");
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const {id} = req.params;
            const benefit = await Benefit.findOne({_id: id});
            res.render("benefits/edit", {
                bodyHolder: benefit,
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {


        try {

            const id = req.params.id;
            const oldUser = await Benefit.findOne({_id: id});

            let bodyHolder = {
                _id: oldUser._id,
                image: oldUser.image,
                title: req.body.name,
                description: req.body.description,
            };


            // Finds the validation errors in this request and wraps them in an object with handy functions
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.render("benefits/edit", {
                    errors: validationErrors.array(),
                    bodyHolder,
                });
            }


            await Benefit.findOneAndUpdate({_id: id}, req.body);
            if (req.files && req.files.image) {
                const file = req.files.image;
                uploadImage(file, "./public/images/uploads/", req).then(async (res) => {

                    await Benefit.findOneAndUpdate({_id: id}, {
                        ...req.body,
                        image: res.image
                    });
                }).catch(err => {
                    req.flash("success_msg", "Error uploading image.");
                    console.log(err);
                });
            }

            req.flash("success_msg", "User updated successfully");
            res.redirect("/benefits");
        } catch (error) {
            next(error);
        }
    },

    benefitDetails: async (req, res, next) => {
        try {
            const {id} = req.params;
            const benefit = await Benefit.findOne({_id: id});
            res.render("benefits/benefit_details", {
                benefit
            });
        } catch (error) {
            next(error);
        }
    },

    getSearch: async (req, res, next) => {
        try {
            const {keyword} = req.params;
            let benefits;
            if (keyword) {
                benefits =   await  Benefit.find({$text: {$search: keyword}})
            } else {
                 benefits = await Benefit.find();
            }
            res.render("benefits/search", {
                benefits
            });
        } catch (error) {
            next(error);
        }
    }
};