const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const robotsRouter = require('./routes/robots');

//CORS Security for the clients website to disable same/-origin-Security
// import of the security middleware
const { setCors } = require('./middleware/security');

const app = express();

app.use(logger('dev'));

/** SETTING UP LOWDB */
const adapter = new FileSync('data/db.json');
const db = low(adapter);
db.defaults({
  robots: [],
}).write();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//SET CORS TO OMIT SECURITY ERRORS
app.use(setCors);

//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    error: {
      message: err.message,
    },
  });
});

//ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/robots', robotsRouter);

module.exports = app;
