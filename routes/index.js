const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");
const {check} = require('express-validator');
const {redirectIfAuthenticated, redirectIfNotUser} = require('../helpers/middlewares');

router.get("/", redirectIfAuthenticated, indexController.index);

router.get("/profile", [
    redirectIfAuthenticated,
    redirectIfNotUser
],indexController.editProfile);

router.post("/profile", [
    redirectIfAuthenticated,
    check('name').not().isEmpty().withMessage("Name is required"),
    check('mobile').not().isEmpty().withMessage("Mobile is required"),
    check('department').not().isEmpty().withMessage("Department is required"),
], indexController.updateProfile);


// Delete applied for all models  ...
router.delete("/delete",redirectIfAuthenticated, indexController.deleteItem);


module.exports = router;
