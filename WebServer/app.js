var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var doctorRouter = require('./routes/doctor');
var patientRouter = require('./routes/patient');
const Doctor = require('./model/doctor');
const Patient = require('./model/patient');
const ejsMate = require('ejs-mate')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project')
.then(() => {
  console.log('Connected to MongoDB')
})
.catch((err) => {
  console.log(err)
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.use(session({
  secret: 'somesecret',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if(req.session.user){
    res.locals.login = true;
    if(req.session.user.doctor){
      res.locals.doctor = true;
      res.locals.patient = false;
    }else{
      res.locals.patient = true;
      res.locals.doctor = false;
    }
  }else{
    res.locals.login = false;
    res.locals.doctor = false;
    res.locals.patient = false;
  }
  next()
})

app.get('/register/doctor', (req, res) => {
  res.render('register/doctor');
})

app.post('/register/doctor', async (req, res) => {
  await Doctor.insertMany([req.body]);
  res.redirect('/login');
})

app.get('/login', (req, res) => {
  res.render('login/login');
})

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/register/patient', (req, res) => {
  res.render('register/patient');
})

app.post('/login', async (req, res) => {
  const user = req.body;
  const {username, password} = req.body;
  if(user.doctor){
    const doctor = await Doctor.findOne({username, password});
    if(doctor){
      req.session.user = {'doctor' : true, 'data' : doctor};
      res.redirect('/doctor');
    }else {
      res.redirect('/login');
    }
  }else{
    const patient = await Patient.findOne({username, password});
    if(patient){
      req.session.user = {'doctor' : false, 'data' : patient};
      res.redirect('/patient');
    }
    else{
      res.redirect('/login');
    }
  }
})

app.use((req, res, next) => {
  if(!req.session.user){
    return res.redirect('/login');
  }
  next();
})

app.use('/doctor', doctorRouter);
app.use('/patient', patientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
