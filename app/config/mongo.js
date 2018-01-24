
var exec = require('child_process').exec;
var colors = require('colors')
var mongoose = require('mongoose')
const config = require('config-yml');

var mongoProcess = exec('mongod')

var initialBootstrap = new Promise(function(resolve, reject) {
  attachProcessListeners()
  .then(connectMongooseToMongo)
  .then(resolve)
  .catch(attachProcessListeners)
})

/*
 * we can attach event listeners to the child process that executes
 * mongod here. Pretty awesome actually.
 */

function attachProcessListeners () {
  return new Promise(function(resolve, reject) {

    var events = {
      onMongoData: function(data) {
        console.log(colors.yellow('[MONGO] stdout: ' + data))
        if(data.indexOf("waiting for connections") != -1) {
          console.log("=========================== MONGO DB STARTED =========================".green)
          resolve()
        }
      },
      onMongoError: function(data) {
        console.log('[MONGO] stdout: ' + data)
        reject()
      },
      onMongoClose: function(code) {
        console.log(colors.red('[MONGO] closing code: ' + code))
      }
    }

    mongoProcess.stdout.on('data', events.onMongoData)
    mongoProcess.stderr.on('data', events.onMongoError)
    mongoProcess.on('close', events.onMongoClose)
  })
}

function connectMongooseToMongo () {
  return new Promise (function (resolve, reject) {
    mongoose.connect(config.mongodb.connection_string)

    mongoose.connection.on('connected', function () {  
      console.log("=========================== MONGOOSE CONNECTED =========================".green)
      resolve()
    }); 
    mongoose.connection.on('error', function () {  
      console.log("=========================== MONGOOSE ERROR =========================".red)
      reject()
    }); 
  })
}

module.exports = {
  init: initialBootstrap
}




