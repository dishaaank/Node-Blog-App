require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoStore = require('connect-mongo');

const connectdb = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const  app = express();
const PORT = process.env.PORT || 5000;

connectdb();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'genius school',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));


app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});
