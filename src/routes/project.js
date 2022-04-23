const { Router } = require('express');
const router = Router();
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/project');
const cRule = require('../validation_schema/common');

const {
  add,
  update,
  list,
  projectById,
  searchList,
  bookmark,
  bookmarkList,
  comment,
  deleletComment,
  upVote,
  followUser
} = require('../controller/project');

router.post('/add', validator(vRule.add), add);
router.post('/update', validator(vRule.update), update);
router.get('/list', validator(vRule.list, 'query'), list);
router.get('/list/:id', validator(cRule.id, 'params'), projectById);
router.get('/searchList', validator(vRule.search, 'query'), searchList);

// ---------------------- Project related actions ----------------------
router.post('/bookmark', validator(vRule.bookmark), bookmark);
router.get('/bookmarkList', validator(vRule.list, 'query'), bookmarkList);

router.post('/comment', validator(vRule.comment), comment);
router.post('/deleteComment', validator(cRule.id), deleletComment);

router.post('/upVote', validator(cRule.id), upVote);

router.post('/follow', validator(vRule.follow), followUser);

module.exports = router;
