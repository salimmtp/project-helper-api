const db = require('../util/db');

// add
exports.add = async (data, department) => {
  const conn = await db.getConnection();
  try {
    await conn.query('START TRANSACTION');

    const [insertedData] = await conn.query(`INSERT INTO projects SET ?;`, [data]);

    const insertDeptIds = department.map(dId => {
      return [insertedData.insertId, dId];
    });
    await conn.query('INSERT INTO project_department (project_id, department_id) VALUES ?;', [insertDeptIds]);

    await conn.commit();
    await conn.release();
    return Promise.resolve(true);
  } catch (e) {
    await conn.query('ROLLBACK');
    await conn.release();
    return Promise.reject(e);
  }
};

// delete project
exports.delete = async projectId => {
  const conn = await db.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await conn.query(
      `DELETE FROM project_upvotes WHERE project_id = ?;
    DELETE FROM bookmarks WHERE project_id = ?;
    DELETE FROM comments WHERE project_id = ?;
    DELETE FROM project_views WHERE project_id = ?;
    DELETE FROM project_department WHERE project_id = ?;`,
      [projectId, projectId, projectId, projectId, projectId]
    );
    await conn.query(`DELETE FROM projects WHERE id=?`, [projectId]);
    await conn.commit();
    await conn.release();
    return Promise.resolve(true);
  } catch (e) {
    await conn.query('ROLLBACK');
    await conn.release();
    return Promise.reject(e);
  }
};

exports.list = async (page, limit, usrid = 0) => {
  try {
    let startNum = parseInt(page) * limit;
    let searchResultFor = '';
    let sqlQuery = `SELECT p.id,p.topic,p.description,u.name,u.username,
    GROUP_CONCAT(d.id) departments,GROUP_CONCAT(d.name) as departments_name,p.created_at,
    (SELECT b.user_id FROM bookmarks b WHERE b.user_id = ? AND project_id = p.id) as isBookmarked,
    (SELECT COUNT(pv.project_id) FROM project_views pv WHERE pv.project_id = p.id) as views,
    (SELECT COUNT(id) FROM comments c WHERE c.project_id = p.id) as comments,
    (SELECT COUNT(pu.project_id) FROM project_upvotes pu WHERE pu.project_id = p.id) as upvotes 
    FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id 
    LEFT JOIN deparments d on pd.department_id = d.id 
    LEFT JOIN users u on p.user_id = u.id
    WHERE pd.department_id IN (SELECT ud.department_id FROM user_department ud WHERE ud.user_id = ?)`,
      sqlParams = [usrid, usrid];

    sqlQuery += ` GROUP BY p.id`;
    const [rows] = await db.query(sqlQuery, sqlParams);

    let totalCount = rows.length;
    sqlQuery += ` ORDER BY p.id DESC LIMIT ${db.escape(parseInt(limit))} OFFSET ${db.escape(startNum)}`;
    var [resultInfo] = await db.query(sqlQuery, sqlParams);
    var data_info = { total: totalCount, data: resultInfo, resultFor: searchResultFor };
    return Promise.resolve(data_info);
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.search = async (page, limit, filter, usrid = 0) => {
  try {
    let startNum = parseInt(page) * limit;
    const { search = '', level = '', userId = '', department = '' } = filter;
    let searchResultFor = '';
    let sqlQuery = `SELECT p.id,p.topic,p.description,u.name,u.username,
    GROUP_CONCAT(d.id) departments,GROUP_CONCAT(d.name) as departments_name,p.created_at,
    (SELECT b.user_id FROM bookmarks b WHERE b.user_id = ? AND project_id = p.id) as isBookmarked,
    (SELECT COUNT(pv.project_id) FROM project_views pv WHERE pv.project_id = p.id) as views,
    (SELECT COUNT(id) FROM comments c WHERE c.project_id = p.id) as comments,
    (SELECT COUNT(pu.project_id) FROM project_upvotes pu WHERE pu.project_id = p.id) as upvotes 
    FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id 
    LEFT JOIN deparments d on pd.department_id = d.id 
    LEFT JOIN users u on p.user_id = u.id
    WHERE 1=1`,
      sqlParams = [usrid];

    if (search) {
      // let searchP = `%${search}%`;
      // sqlQuery += ` AND (p.topic like ? OR p.description like ? OR p.skills like ?)`;
      // sqlParams.push(searchP);
      // sqlParams.push(searchP);
      // sqlParams.push(searchP);
      // console.log({ search });
      searchResultFor = search;
      sqlQuery += ` AND MATCH(skills,topic,description) Against(?)`;
      sqlParams.push(search);
    }

    // search based on project level
    if (level) {
      sqlQuery += ` AND p.level = ?`;
      sqlParams.push(level);
    }

    // based on user
    if (userId) {
      const [use] = await db.query(`SELECT name FROM users u WHERE u.id = ?;`, [userId]);
      searchResultFor = use.length ? use[0].name : '';
      sqlQuery += ` AND p.user_id = ?`;
      sqlParams.push(userId);
    }

    // based on deparment
    if (department) {
      const [dep] = await db.query(`SELECT name FROM deparments d WHERE d.id = ?;`, [department]);
      searchResultFor = dep.length ? dep[0].name : '';
      sqlQuery += ` AND pd.department_id = ?`;
      sqlParams.push(department);
    }

    sqlQuery += ` GROUP BY p.id`;
    // console.log({ sqlQuery, sqlParams });
    const [rows] = await db.query(sqlQuery, sqlParams);
    let totalCount = rows.length;
    sqlQuery += ` ORDER BY p.id DESC LIMIT ${db.escape(parseInt(limit))} OFFSET ${db.escape(startNum)}`;
    var [resultInfo] = await db.query(sqlQuery, sqlParams);
    var data_info = { total: totalCount, data: resultInfo, resultFor: searchResultFor };
    return Promise.resolve(data_info);
  } catch (e) {
    // console.log({ e });
    return Promise.reject(e);
  }
};

exports.projectById = async (projectId, userId) => {
  try {
    // project views
    const [data] = await db.query(`SELECT * FROM projects WHERE id = ? AND user_id = ?;`, [projectId, userId]);
    if (!data.length) {
      await db.query(`INSERT IGNORE project_views SET ?;`, [
        {
          project_id: projectId,
          user_id: userId
        }
      ]);
    }
    let sqlQuery = `SELECT p.id,p.topic,p.description,u.name,u.username,p.skills,p.user_id,
      GROUP_CONCAT(d.id) departments,GROUP_CONCAT(d.name) as departments_name,p.created_at,
      (SELECT pu.user_id FROM project_upvotes pu WHERE pu.user_id = ? AND pu.project_id = p.id) as isUpvoted,
      (SELECT COUNT(pv.project_id) FROM project_views pv WHERE pv.project_id = p.id) as views,
      (SELECT COUNT(id) FROM comments c WHERE c.project_id = p.id) as comments,
      (SELECT COUNT(pu.project_id) FROM project_upvotes pu WHERE pu.project_id = p.id) as upvotes,
      (SELECT uf.user_id FROM user_following uf WHERE uf.following_user_id = p.user_id AND uf.user_id = ?) as isFollowing 
      FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id 
      LEFT JOIN deparments d on pd.department_id = d.id 
      LEFT JOIN users u on p.user_id = u.id
      WHERE p.id = ?;
      SELECT c.id,u.name,c.comment, IF(user_id=?,true,false) as isCreated,c.replyTo,c.created_at as date FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.project_id = ? AND c.replyTo = 0 ORDER BY c.id DESC;
      `,
      sqlParams = [userId, userId, projectId, userId, projectId];
    return db.query(sqlQuery, sqlParams);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.isProjectExist = projectId => db.query(`SELECT id FROM projects WHERE id = ?`, [projectId]);
exports.isProjectBelongToUser = (projectId, userId) =>
  db.query(`SELECT id FROM projects p WHERE p.id =? AND user_id =?`, [projectId, userId]);

exports.departments = (search = '') => {
  let sqlQuery = `SELECT id,name FROM deparments WHERE status = 1`,
    sqlParams = [];
  if (search) {
    sqlQuery += ` AND name like ?`;
    sqlParams.push(`%${search}%`);
  }
  return db.query(sqlQuery, sqlParams);
};

exports.searchUsers = search => {
  let sqlQuery = `SELECT * FROM users`,
    sqlParams = [];
  if (search) {
    sqlQuery += ` WHERE name LIKE ? OR username like ?`;
    sqlParams.push(`%${search}%`);
    sqlParams.push(`%${search}%`);
  }
  sqlQuery += ` ORDER BY id DESC LIMIT 5;`;
  return db.query(sqlQuery, sqlParams);
};

// Comments
exports.commentReplys = (id, userId) => {
  return db.query(
    `SELECT c.id,u.name,c.comment, IF(user_id=?,true,false) as isCreated ,c.created_at as date FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.replyTo = ?;`,
    [userId, id]
  );
};

exports.comment = data => db.query(`INSERT INTO comments SET ?`, [data]);

exports.deleteComment = (id, userId) => db.query(`DELETE FROM comments WHERE id = ? AND user_id = ?`, [id, userId]);

// upvote
exports.isupVoteExist = async (userId, projectId) => {
  try {
    const [data] = await db.query(`SELECT user_id FROM project_upvotes WHERE user_id = ? AND project_id = ?;`, [
      userId,
      projectId
    ]);
    if (data.length) return Promise.resolve(true);
    else return Promise.resolve(false);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.addUpVote = (userId, projectId) =>
  db.query(`INSERT INTO project_upvotes SET ?;`, [
    {
      project_id: projectId,
      user_id: userId
    }
  ]);

exports.deleteUpVote = (userId, projectId) =>
  db.query(`DELETE FROM project_upvotes WHERE user_id = ? AND project_id = ?`, [userId, projectId]);

// follow user
exports.isUserFollowingExist = async (userId, user) => {
  try {
    const [data] = await db.query(`SELECT user_id FROM user_following WHERE user_id = ? AND following_user_id = ?;`, [
      userId,
      user
    ]);
    if (data.length) return Promise.resolve(true);
    else return Promise.resolve(false);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.follow = async (userId, user, notification) => {
  try {
    await db.query(`INSERT IGNORE INTO notifications SET ?`, [{ notification, user_id: user }]);
    await db.query(`INSERT  INTO user_following SET ?;`, [
      {
        user_id: userId,
        following_user_id: user
      }
    ]);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.unfollow = (userId, user) =>
  db.query(`DELETE FROM user_following WHERE user_id = ? AND following_user_id = ?`, [userId, user]);
