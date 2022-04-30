const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const moment = require('moment');

// adding flash and sessions
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
// create an instance of express app
const app = express();

// import csrf
const csrf = require('csurf')
app.use(csrf());
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash('error_messages', 'The form has expired. Please try again');
    res.redirect('back');
  } else {
    next()
  }
});

// set the view engine
app.set("view engine", "hbs");
hbs.handlebars.registerHelper("formatDate", function (datetime) {
  return moment(datetime).format('YYYY, D MMM');
})

hbs.handlebars.registerHelper("formatDateTime", function (datetime) {
  return moment(datetime).format('LLL');
})

hbs.handlebars.registerHelper("dollarAmount", function (price) {
  let dollars = price / 100;
  dollars = dollars.toLocaleString("en-SG", {
    style: "currency",
    currency: "SGD"
  });
  return dollars
})

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

// share the user data with all hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
})

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

app.use(function (req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
})

// import in routes
const landingRoutes = require('./routes/landing')
const recordRoutes = require('./routes/records')
const artistRoutes = require('./routes/artists')
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')
const cartRoutes = require('./routes/shoppingCart')


async function main() {
  app.use(express.static( "/public"));
  app.use('/', landingRoutes)
  app.use('/records', recordRoutes)
  app.use('/artists', artistRoutes)
  app.use('/users', userRoutes)
  app.use('/cloudinary', cloudinaryRoutes)
  app.use('/cart', cartRoutes)
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});