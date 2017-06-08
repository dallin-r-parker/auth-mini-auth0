const express = require('express');
const session = require('express-session');
const passport = require('passport');
const auth0 = require('passport-auth0');
const bodyParser = require('body-parser');
const massive = require('massive');
const massifier = require('dm-massifier')('postgresql://localhost:5432/user_test');
const cors = require('cors');
const port = 3000;

// Expose express through app
const app = express();

app.use(bodyParser.json());
app.use(massifier.middleware());
app.use(cors());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboardcat'
}))
app.use(passport.initialize());
app.use(passport.session());





app.listen(port, ()=> {console.log(`auth-app is on ${port}`) });
