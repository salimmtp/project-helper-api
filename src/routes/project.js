const { Router } = require('express');
const router = Router();
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/project');
const cRule = require('../validation_schema/common');

const { add, update, list, projectById, searchList } = require('../controller/project');

router.post('/add', validator(vRule.add), add);
router.post('/update', validator(vRule.update), update);
router.get('/list', validator(vRule.list, 'query'), list);
router.get('/list/:id', validator(cRule.id, 'params'), projectById);
router.get('/searchList', validator(vRule.search, 'query'), searchList);

module.exports = router;
