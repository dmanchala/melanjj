/* eslint global-require: 0 */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const keys = require('./config/keys');
require('./models/User');
require('./models/Dataset');

mongoose.connect(keys.mongoUri);

const app = express();

app.use(bodyParser.json());

const cookieSession = require('cookie-session');
const passport = require('passport');
require('./services/passport');

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('tiny'));

require('./auth/authRoutes')(app);
require('./query/datasetMetadataRoutes')(app);
require('./query/queryDatasetRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 2000;
module.exports = app.listen(PORT);
