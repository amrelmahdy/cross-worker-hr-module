const express = require("express");
const router = express.Router();
const {check} = require('express-validator');
const userController = require("../controllers/user");
const {redirectIfAuthenticated, redirectIfNotAuthorized} = require('../helpers/middlewares');

router.all('/*', [redirectIfAuthenticated, redirectIfNotAuthorized], (req, res, next) => {
    next();
});

/* *********************** Routes *************************************** */
router.get("/", userController.getAll);
router.get("/create", userController.create);
router.post("/create", [
    check('name').not().isEmpty().withMessage("Name is required"),
    check('email').not().isEmpty().withMessage("Email is required"),
    check('email').isEmail().withMessage("Email must be a valid one"),
    check('mobile').not().isEmpty().withMessage("Mobile is required"),
    check('department').not().isEmpty().withMessage("Department is required"),
    check('password').not().isEmpty().withMessage("Password is required")
], userController.save);

router.get("/:id/edit", userController.edit);
router.post("/:id", [
    check('name').not().isEmpty().withMessage("Name is required"),
    check('email').not().isEmpty().withMessage("Email is required"),
    check('email').isEmail().withMessage("Email must be a valid one"),
    check('mobile').not().isEmpty().withMessage("Mobile is required"),
], userController.update);


module.exports = router;