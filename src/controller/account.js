const accountModel = require('../model/account');
const projectModel = require('../model/project');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
//  ---------------------------------------------------------------------------------------------
//  --------------------------------------- Account Update --------------------------------------
//  ---------------------------------------------------------------------------------------------
// @method  : GET
// @desc    : user data for update purpose
exports.getUserData = async (req, res) => {
  try {
    const { id } = req.decoded;
    const [userData] = await accountModel.getUserData(id);
    if (!userData.length) return res.status(403).json({ message: 'user not found' });
    const [departments] = await projectModel.departments();
    res.json({ message: 'account info', data: userData[0], departments });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : update account
exports.accountUpdate = async (req, res) => {
  try {
    const { id } = req.decoded;
    await accountModel.updateAccount(req.body, id);
    const [userData] = await accountModel.getUserData(id);
    res.json({ message: 'Account updated.', data: userData[0] });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

// @method  : POST
// @desc    : password update
exports.passwordUpdate = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { password } = req.body;
    let hashedPwd = await bcrypt.hash(password, 10);
    await accountModel.updatePwd(hashedPwd, id);
    res.json({ message: 'Password Updated' });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

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

//  ---------------------------------------------------------------------------------------------
//  --------------------------------------- Messages -------------------------------------------
//  ---------------------------------------------------------------------------------------------

// @desc Get message list
exports.messageList = async (req, res) => {
  try {
    const { id } = req.decoded;
    const [data] = await accountModel.messageList(id);
    res.json({ message: 'Messages list', data });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};
// @desc Get message list by user id
exports.messageListByUserId = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { id: userId } = req.params;
    const [data] = await accountModel.messageListByUserId(userId, id);
    res.json({ message: 'Messages list', data: { user: data[1]?.[0], messages: data[0] } });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

//  ---------------------------------------------------------------------------------------------
//  ---------------------------------------- Following ------------------------------------------
//  ---------------------------------------------------------------------------------------------
// @method  : GET
// @desc    : list of followings
exports.followings = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { page, limit } = req.query;
    const data = await accountModel.followings(page, limit, id);
    res.json({ message: 'following list', data });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};
