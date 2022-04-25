const { Router } = require('express');
const router = Router();
const { bookmark, bookmarkList, notifications, newNotifications } = require('../controller/account');
const validator = require('../helper/validator');

// validation schema rules - Joi Schema
const vRule = require('../validation_schema/account');

// Bookmarks
router.post('/bookmark', validator(vRule.bookmark), bookmark);
router.get('/bookmarkList', validator(vRule.list, 'query'), bookmarkList);

// Notifications
router.get('/notifications', validator(vRule.list, 'query'), notifications);

// loginData
router.get('/', newNotifications);

module.exports = router;
