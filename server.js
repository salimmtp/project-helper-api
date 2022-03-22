const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

const data = [
  {
    id: 1,
    description: `Future wireless network will provide users the possibility to be “always best connected” by using different
    radio access network technologies (RAT). This latter, opens path towards the development of Network
    Selection Algorithms able to evaluate and select the most proper and available network interface,
    satisfying the user requirements and keeping the connection “alive”.`,
    title: 'Network Selection Algorithms in Heterogeneous Wireless Networks'
  },
  {
    id: 2,
    description: `The Internet-of-Things (IoT) is a vision in which every physical object – enriched with communication
    capabilities – acquires an electronic identity and acts as a source of information. The rapid uptake of IoT
    technologies in different application domains is causing a tremendous increase in the amount of data
    being collected, stored and processed, above all in Industrial Manufacturing and Process Industries
    domain. In order to handle the increasing amount of data in sustainable fashion, many industrial players
    are deploying scalable data platforms based on open technologies, both using in-premises or cloudoriented systems.`,
    title: 'Open Data Platforms for the Industrial Internet of Things (IoT)'
  },
  {
    id: 3,
    description: `Various services are available via websites or via separate apps. This project installs monitoring software
    (e.g. from Privacy International https://privacyinternational.org/node/2732) and observes the difference
    between running the two versions in terms of what/when information is passed to the app’s owners and
    other services such as advertising networks. Maybe do this for 10 apps and draw some preliminary
    conclusions on whether apps or browsers are better in terms of privacy.`,
    title: 'APPS or BROWSER - privacy forensics?'
  },
  {
    id: 4,
    description: `There are a fair few browser extensions to increase privacy by blocking trackers etc. This project performs
    experiments by comparing network information streams between browsers with and without such
    trackers. This could be on Linux with network monitoring software installed, or on Android with
    monitoring software (e.g. from Privacy International https://privacyinternational.org/node/2732)`,
    title: 'HOW EFFECTIVE ARE BROWSER PRIVACY EXTENSIONS?'
  },
  {
    id: 5,
    description: `Smart meters are being rolled out for electricity, gas, and water in many countries. This is a comparative
    study on the different regulations for such meters in different places in terms of how they affect privacy
    of consumers and security of the meters. A shallow analysis for a pass mark will just give lots of rules and
    how they differ; a deeper analysis for a great mark will think through creatively what the privacy impacts
    of such different rules are.`,
    title: 'SMART METERS ACROSS THE WORLD: SECURITY & PRIVACY'
  }
];

app.use('/getData', (req, res) => {
  const { search } = req.query;
  let newData = data.filter(e => e.description.indexOf(search) !== -1);
  res.json({
    message: 'data',
    data: newData
  });
});

app.post('/add', (req, res, next) => {
  console.log({ body: req.body });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
