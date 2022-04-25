const accountModel = require('../model/account');
const projectModel = require('../model/project');
const dayjs = require('dayjs');

//  ---------------------------------------------------------------------------------------------
//  ------------------------------------------ Bookmarks ----------------------------------------
//  ---------------------------------------------------------------------------------------------

// @method  : GET
// @desc    : list of bookmarks
exports.bookmarkList = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { page, limit } = req.query;
    const data = await accountModel.listBookmark(page, limit, id);
    res.json({ message: 'bookmark list', data });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : bookmarking the project
exports.bookmark = async (req, res) => {
  try {
    const { id: userId } = req.decoded;
    const { id } = req.body;

    const [isProjectExist] = await projectModel.isProjectExist(id);
    if (!isProjectExist.length) return res.status(403).json({ message: 'Project id not found' });

    const isExist = await accountModel.isBookmarkExist(userId, id);

    if (isExist) await accountModel.deleteBookmark(userId, id);
    else await accountModel.addBookmark(userId, id);

    res.json({ message: isExist ? 'removed from bookmark' : 'saved to bookmark' });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

//  ---------------------------------------------------------------------------------------------
//  --------------------------------------- Notifications ----------------------------------------
//  ---------------------------------------------------------------------------------------------

exports.notifications = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { page, limit } = req.query;
    const data = await accountModel.listNotifications(page, limit, id);
    res.json({ message: 'Notifications list', data });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

exports.newNotifications = async (req, res) => {
  try {
    const { id } = req.decoded;
    const [data] = await accountModel.newNotification(id);
    if (!data.length) return res.status(403).json({ message: 'User not found' });
    res.json({ notification: data[0].count, message: 0 });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};
