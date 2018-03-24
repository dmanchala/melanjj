const sendgridMail = require('@sendgrid/mail');
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

const createEmail = (id) => `
<html>
  <body>
    <div>
      <a href=${keys.redirectDomain}/api/admin/users/${id}/approve>Approve</a>
    </div>
  </body>
</html>
`;

module.exports = async (user) => {
  const admins = await User.find({ admin: true });
  const adminEmails = admins.map((admin) => admin.email);

  sendgridMail.setApiKey(keys.sendgridKey);
  const email = {
    to: adminEmails,
    from: 'no-reply@melanjj.com',
    subject: `Let's go. ${user.email} just signed up for Melanjj.`,
    html: createEmail(user.id),
  };
  sendgridMail.send(email);
};
