
var fs = require('fs');
var config = require('./app/config')
var express = require('express')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mediacenter');

var app = express()

app.listen(8000)
app.use(express.static(__dirname + '/public'));

require('./app/routes')(app)
require('./app')()


// PAGES
// - Main
// - Admin Page
// - File View