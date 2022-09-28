const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public/FILES')));

// Create path to shared folder
const filePath = path.join(__dirname, 'public/FILES');

app.get('/', (_req, res) => {
  const arr = [];

  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log(`Unable to scan directory: ${err}`);
    }

    // create array of all files found in directory
    files.forEach((file) => {
      arr.push(file);
    });

    res.set('Cache-Control', 'public, no-store');
    res.render('index', { doc: arr });
  });
});

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;
