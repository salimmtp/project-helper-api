const { Router } = require('express');
const router = Router();
const db = require('../util/db');

router.get('/deparments', async (req, res) => {
  try {
    const [data] = await db.query(`
    SELECT id,name FROM deparments WHERE type = 2 AND status = 1;
    SELECT id,name FROM deparments WHERE type = 3 AND status = 1;
    `);
    res.json({ message: 'Departments', departments: { undergrad: data[0], postgrad: data[1] } });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
