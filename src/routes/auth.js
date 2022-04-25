const { Router } = require('express');
const router = Router();
const { register, login, forgotPassword, validateUser, resetPassword } = require('../controller/auth');
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/auth');

router.post('/register', validator(vRule.register), register);
router.post('/login', validator(vRule.login), login);

// forgot password
router.post('/forgotPassword', validator(vRule.forgotPwd), forgotPassword);
router.get('/validateUser/:token/:email', validator(vRule.validateUser, 'params'), validateUser);
router.post('/resetPassword', validator(vRule.verifyUser), resetPassword);

module.exports = router;
