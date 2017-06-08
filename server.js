require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const bodyParser = require('body-parser');
const massive = require('massive');
const massifier = require('dm-massifier')(process.env.DB_CONN);
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
  secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize());
app.use(passport.session());



passport.use(new Auth0Strategy({
   domain:       process.env.DOMAIN,
   clientID:     process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
   callbackURL:  '/auth/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    //Find user in database
    req.db.getUserByAuthId([profile.id], (err, user) => {
      user = user[0];
      if (!user) { //if there isn't one, we'll create one!
        console.log('CREATING USER');
        req.db.createUserByAuth([profile.displayName, profile.id], (err, user) => {
          console.log('USER CREATED', userA);
          return done(err, user[0]); // GOES TO SERIALIZE USER
        })  //make sure the you pass ERR or Null first or else it will assume it's an err when it's the user object.
      } else { //when we find the user, return it
        console.log('FOUND USER', user);
        return done(err, user);
      }
    })
  }
));

passport.serializeUser(function(userA, done) {
  console.log('serializing', userA);
  var userB = userA;
  //Things you might do here :
   //Serialize just the id, get other information to add to session,
  done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function(userB, done) {
  var userC = userC;
  //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
  done(null, userC); //PUTS 'USER' ON REQ.USER
});



app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    res.status(200).send(req.user);
})

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})




app.listen(port, ()=> {console.log(`auth-app is on ${port}`) });
