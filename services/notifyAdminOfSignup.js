const sendgrid = require('sendgrid');
const mongoose = require('mongoose');
const keys = require('../config/keys');

const { mail } = sendgrid;
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

class NotifyAdminOfSignupEmail extends mail.Mail {
  constructor({ email, id }, admins) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new mail.Email('no-reply@melanjj.com');
    this.subject = `Let's go. ${email} just signed up for Melanjj.`;
    const body = mail.Content('text/html', createEmail(id));
    this.addContent(body);
    this.recipients = admins.map((admin) => new mail.Email(admin.email));
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/email/send',
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

const getAdmins = async () => User.find({ admin: true });

module.exports = async (user) => {
  const admins = await getAdmins();
  const email = new NotifyAdminOfSignupEmail(user, admins);

  try {
    await email.send();
  } catch (err) {
    return err;
  }

  return undefined;
};
