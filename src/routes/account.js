const { Router } = require('express');
const router = Router();
const {
  bookmark,
  bookmarkList,
  notifications,
  newNotifications,
  followings,
  getUserData,
  accountUpdate,
  passwordUpdate
} = require('../controller/account');
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/account');

// Bookmarks
router.post('/bookmark', validator(vRule.bookmark), bookmark);
router.get('/bookmarkList', validator(vRule.list, 'query'), bookmarkList);

// following
router.get('/following', validator(vRule.list, 'query'), followings);

// Notifications
router.get('/notifications', validator(vRule.list, 'query'), notifications);

// account update
router.get('/user', getUserData);
router.post('/update', validator(vRule.accountUpdate), accountUpdate);
router.post('/pwdUpdate', validator(vRule.updatePassword), passwordUpdate);

// loginData
router.get('/', newNotifications);

module.exports = router;
