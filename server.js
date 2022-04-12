const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

const data = [];

app.use('/getData', (req, res) => {
  const { search } = req.query;
  let newData = data.filter(e => e.description.indexOf(search) !== -1);
  res.json({
    message: 'data',
    data: newData
  });
});

// routes
const project = require('./src/routes/project');
const configData = require('./src/routes/configData');
const account = require('./src/routes/account');

const router = express.Router();
router.use('/project', project);
router.use('/config', configData);
router.use('/account', account);

app.use('/api/v1', router);

app.use((req, res) => {
  res.json({ message: 'no link found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
