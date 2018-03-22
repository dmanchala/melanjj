const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoUri);

const app = express();

app.use(passport.initialize());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 2000;
app.listen(PORT);
