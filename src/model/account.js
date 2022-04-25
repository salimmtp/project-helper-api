const db = require('../util/db');

// bookmark
exports.listBookmark = async (page, limit, usrid = 0) => {
  try {
    let startNum = parseInt(page) * limit;
    let sqlQuery = `SELECT p.id,p.topic,p.description,u.name,u.username,
      p.created_at,
      (SELECT b.user_id FROM bookmarks b WHERE b.user_id = ? AND project_id = p.id) as isBookmarked,
      (SELECT COUNT(pv.project_id) FROM project_views pv WHERE pv.project_id = p.id) as views,
      (SELECT COUNT(id) FROM comments c WHERE c.project_id = p.id) as comments,
      (SELECT COUNT(pu.project_id) FROM project_upvotes pu WHERE pu.project_id = p.id) as upvotes 
      FROM bookmarks b 
      LEFT JOIN projects p ON p.id = b.project_id 
      LEFT JOIN project_department pd on p.id = pd.project_id 
      LEFT JOIN users u on p.user_id = u.id 
      WHERE b.user_id = ?`,
      sqlParams = [usrid, usrid];
    sqlQuery += ` GROUP BY p.id`;
    // console.log({ sqlQuery, sqlParams });
    const [rows] = await db.query(sqlQuery, sqlParams);
    let totalCount = rows.length;
    sqlQuery += ` ORDER BY b.created_at DESC LIMIT ${db.escape(parseInt(limit))} OFFSET ${db.escape(startNum)}`;
    var [resultInfo] = await db.query(sqlQuery, sqlParams);
    var data_info = { total: totalCount, data: resultInfo };
    return Promise.resolve(data_info);
  } catch (e) {
    // console.log({ e });
    return Promise.reject(e);
  }
};

exports.isBookmarkExist = async (userId, projectId) => {
  try {
    const [data] = await db.query(`SELECT user_id FROM bookmarks WHERE user_id = ? AND project_id = ?;`, [userId, projectId]);
    if (data.length) return Promise.resolve(true);
    else return Promise.resolve(false);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.addBookmark = (userId, projectId) =>
  db.query(`INSERT INTO bookmarks SET ?;`, [
    {
      project_id: projectId,
      user_id: userId
    }
  ]);

exports.deleteBookmark = (userId, projectId) =>
  db.query(`DELETE FROM bookmarks WHERE user_id = ? AND project_id = ?`, [userId, projectId]);

// notifications
exports.listNotifications = async (page, limit, userId) => {
  try {
    let startNum = parseInt(page) * limit;
    let sqlQuery = `SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ${db.escape(
      parseInt(limit)
    )} OFFSET ${db.escape(startNum)}`;
    sqlParams = [userId];
    const [rows] = await db.query(`SELECT COUNT(id) as count FROM notifications WHERE user_id = ?;`, sqlParams);
    let totalCount = rows[0].count;
    var [resultInfo] = await db.query(sqlQuery, sqlParams);
    await db.query(`UPDATE notifications SET ? WHERE user_id = ?`, [{ is_read: 1 }, userId]);
    var data_info = { total: totalCount, data: resultInfo };
    return Promise.resolve(data_info);
  } catch (e) {
    console.log({ e });
    return Promise.reject(e);
  }
};
