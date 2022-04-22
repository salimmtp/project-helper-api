const db = require('../util/db');

// add
exports.add = async (data, department) => {
  try {
    const conn = await db.getConnection();
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

exports.list = async (page, limit, filter) => {
  try {
    let startNum = parseInt(page) * limit;
    const { search = '', level = '', userId = '', department = '' } = filter;
    let searchResultFor = '';
    let sqlQuery = `SELECT p.id,p.topic,p.description,u.name,u.username,
    GROUP_CONCAT(d.id) departments,GROUP_CONCAT(d.name) as departments_name,p.created_at,
    (SELECT COUNT(pv.project_id) FROM project_views pv WHERE pv.project_id = p.id) as views,
    (SELECT COUNT(id) FROM comments c WHERE c.project_id = p.id) as comments,
    (SELECT COUNT(pu.project_id) FROM project_upvotes pu WHERE pu.project_id = p.id) as upvotes 
    FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id 
    LEFT JOIN deparments d on pd.department_id = d.id 
    LEFT JOIN users u on p.user_id = u.id
    WHERE 1=1`,
      sqlParams = [];

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
    return Promise.reject(e);
  }
};

exports.projectById = projectId =>
  db.query(
    `SELECT p.*,GROUP_CONCAT(d.id) departments,GROUP_CONCAT(d.name) as departments_name 
    FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id 
    LEFT JOIN deparments d on pd.department_id = d.id 
    WHERE p.id = ? GROUP BY p.id;`,
    [projectId]
  );

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
// db.query(`SELECT * FROM users WHERE name LIKE ? OR username like ? `, [`%${search}%`, `%${search}%`]);

// exports.departmentSearch = (query) => {
//   db.query(`SELECT id,name FROM deparments WHERE status = 1`);
// }
