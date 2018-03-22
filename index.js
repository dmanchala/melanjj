const express = require('express');
const passport = require('passport');
require('./services/passport');

const app = express();

app.use(passport.initialize());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 2000;
app.listen(PORT);
