const express = require("express");
const router = express.Router();
const {check} = require('express-validator');
const benefitController = require("../controllers/benefit");
const {redirectIfAuthenticated, redirectIfNotAuthorized} = require('../helpers/middlewares');


router.get("/search/:keyword?", redirectIfAuthenticated, benefitController.getSearch);
router.get("/:id", redirectIfAuthenticated, benefitController.benefitDetails);


/* *********************** Routes *************************************** */
router.get("/", [redirectIfAuthenticated, redirectIfNotAuthorized], benefitController.getAll);

router.get("/create", [redirectIfAuthenticated, redirectIfNotAuthorized], benefitController.create);
router.post("/create", [
    redirectIfAuthenticated,
    redirectIfNotAuthorized,
    check('title').not().isEmpty().withMessage("Name is required"),
    check('description').not().isEmpty().withMessage("Desc is required")
], benefitController.save);
router.get("/:id/edit", [redirectIfAuthenticated, redirectIfNotAuthorized], benefitController.edit);
router.post("/:id", [
    redirectIfAuthenticated, redirectIfNotAuthorized,
    check('title').not().isEmpty().withMessage("Name is required"),
    check('description').not().isEmpty().withMessage("Desc is required"),
], benefitController.update);

module.exports = router;