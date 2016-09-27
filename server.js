
var fs = require('fs');
var config = require('./app/config')
var express = require('express')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mediacenter');
var morgan = require('morgan')
var color = require('color')
var path = require('path')
var FileStreamRotator = require('file-stream-rotator')


var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

var app = express()

app.listen(8000)
app.use(express.static(__dirname + '/public'));

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

require('./app/routes')(app)
require('./app')(process.argv)


// PAGES
// - Main
// - Admin Page
// - File View