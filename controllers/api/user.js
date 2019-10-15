const User = require("../../models/user");
const {createResponse} = require("./../../helpers/getters");
const {errorCodesEnum} = require("./../../config");
const { validationResult } = require("express-validator");

module.exports = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    },
    saveNewUser: async (req, res, next) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            // let errors = req.validationErrors();
            // if (errors) {
            //     let response = createResponse(errorCodesEnum.VALIDATION_ERROR, "", errors, "Error on validation ... ", {});
            //     res.status(200).json(response);
            //     return;
            // }


            const newUser = new User(req.body);
            const user = User.saveUser(newUser, (err, user) => {
                if (err) next(err);
                res.status(200).json(user);
            });
        } catch (error) {
            next(error)
        }
    },

    getUserProfile: async (req, res, next) => {

    },
    replaceUser: async (req, res, next) => {

    },
    updateUser: async (req, res, next) => {

    },
    deleteUser: async (req, res, next) => {

    }
};


