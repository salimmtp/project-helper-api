const { Router } = require('express');
const router = Router();
const { register } = require('../controller/account');

router.post('/register', register);

module.exports = router;
