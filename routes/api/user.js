const express = require("express");
const router = express.Router();
// ...rest of the initial code omitted for simplicity.
const {check} = require('express-validator');

const userController = require("../../controllers/api/user");

//router.get('/', userController.getAllUsers);
router.post('/',
    [
        check('name').not().isEmpty().withMessage("Name is required"),
        check('email').not().isEmpty().withMessage("Email is required"),
        check('email').isEmail().withMessage("Email must be a valid one"),
        check('mobile').not().isEmpty().withMessage("Mobile is required"),
        check('password').not().isEmpty().withMessage("Password is required"),
    ], userController.saveNewUser);
// router.get('/:id', userController.getUserProfile);
// router.put('/:id', userController.replaceUser);
// router.patch('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router;