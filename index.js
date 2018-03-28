const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const keys = require('./config/keys');
require('./models/User');
require('./models/Dataset');
require('./services/passport');

mongoose.connect(keys.mongoUri);

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('tiny'));
}

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./query/datasetMetadataRoutes')(app);
require('./query/graphqlRoutes')(app);

app.use('/api', express.static('static'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  /* eslint global-require: 0 */
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 2000;
app.listen(PORT);
