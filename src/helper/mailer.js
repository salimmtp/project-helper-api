const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (to, subject, html) => {
  const msg = {
    to,
    from: { name: 'DMU project helper', email: 'p2656187@my365.dmu.ac.uk' },
    subject,
    html
  };
  //ES6
  try {
    await sgMail.send(msg);
    return Promise.resolve(true);
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return Promise.reject(error);
  }
};
