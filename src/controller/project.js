const db = require('../util/db');

exports.add = async (req, res, next) => {
  try {
    await db.query(`INSERT INTO projects SET ?`, [{ ...req.body, department: JSON.stringify(req.body.department) }]);
    console.log({ ...req.body, department: req.body.department });
    res.json({ message: 'project added.' });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ message: 'server error' });
  }
};

exports.list = async (req, res, next) => {
  try {
    const [data] = await db.query(`SELECT * FROM projects`);
    res.json({ message: 'projects', data });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
};

exports.projectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [data] = await db.query(`SELECT * FROM projects WHERE id = ?`, [id]);
    console.log({ data });
    if (!data.length) {
      return res.status(403).json({ message: 'data not found' });
    }
    res.json({ message: 'projects', data: data[0] });
  } catch (e) {
    res.status(500).json({ message: 'server error' });
  }
};
