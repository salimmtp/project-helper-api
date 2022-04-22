const db = require('../util/db');
const projectModel = require('../model/project');

// @method : POST
// @desc   : add project
exports.add = async (req, res) => {
  try {
    const { id } = req.decoded;
    const { topic, description, level, skills, department } = req.body;
    await projectModel.add(
      {
        topic,
        description,
        level,
        skills,
        user_id: id
      },
      department
    );
    res.json({ message: 'project added.' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : POST
// @desc   : update project
exports.update = async (req, res) => {
  try {
    const { id: userId } = req.decoded;
    const { topic, description, level, skills, department } = req.body;
    await projectModel.add(
      {
        topic,
        description,
        level,
        skills,
        user_id: id
      },
      department
    );
    res.json({ message: 'project added.' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : list of all project based on the query filter
//           default pagination query values (page:0, limit:10)
exports.list = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const data = await projectModel.list(page, limit, { ...req.query });
    res.json({ message: 'projects', data });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : complete data of project based on the project id passed
exports.projectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [data] = await projectModel.projectById(id);
    if (!data.length) return res.status(403).json({ message: 'data not found' });
    res.json({ message: 'projects', data: data[0] });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
};

// @method : GET
// @desc   : auto complete search keyword based on the query passed
// @return : List of department, users, project max 6 based on the query passed
exports.searchList = async (req, res) => {
  try {
    const { search } = req.query;
    const [departments] = await projectModel.departments(search);
    const [users] = await projectModel.searchUsers(search);
    const projects = await projectModel.list(0, 6, { search });
    res.json({
      message: 'search list',
      data: {
        departments,
        users,
        projects: projects.data
      }
    });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
};

// LIST FULL
// SELECT p.*,GROUP_CONCAT(d.name) as name FROM projects p LEFT JOIN project_department pd on p.id = pd.project_id LEFT JOIN deparments d on pd.department_id = d.id GROUP BY p.id;
