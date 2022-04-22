const { Router } = require('express');
const router = Router();
const projectModel = require('../model/project');

router.get('/deparments', async (req, res) => {
  try {
    const [data] = await projectModel.departments();
    res.json({ message: 'Departments', departments: data });
  } catch (error) {
    // console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
