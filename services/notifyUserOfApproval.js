const sendgridMail = require('@sendgrid/mail');
const keys = require('../config/keys');

/* eslint indent: 0 */
const emailHtmlTemplate = `
<html>
  <body>
    <div>
      <a href=${
        keys.redirectDomain
      }/api/graphql>Start exploring datasets now.</a>
    </div>
  </body>
</html>
`;

module.exports = async (emailId) => {
  sendgridMail.setApiKey(keys.sendgridKey);
  const email = {
    to: emailId,
    from: 'no-reply@melanjj.com',
    subject: 'Your Melanjj account has been activated!',
    html: emailHtmlTemplate,
  };
  sendgridMail.send(email);
};
