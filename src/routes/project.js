const { Router } = require('express');
const router = Router();
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/project');

const { add, list, projectById } = require('../controller/project');

router.post('/add', validator(vRule.add), add);
router.get('/list', list);
router.get('/list/:id', projectById);

module.exports = router;
