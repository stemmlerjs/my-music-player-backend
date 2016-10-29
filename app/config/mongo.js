var exec = require('child_process').exec;
var colors = require('colors')

var mongoProcess = exec('mongod');

/*
 * we can attach event listeners to the child process that executes
 * mongod here. Pretty awesome actually.
 */

function attachProcessListeners(_process) {
  var events = {
    onMongoData: function(data) {
      console.log(colors.yellow('[MONGO] stdout: ' + data));
    },
    onMongoError: function(data) {
      console.log('[MONGO] stdout: ' + data);
    },
    onMongoClose: function(code) {
      console.log(colors.red('[MONGO] closing code: ' + code));
    }
  }

  mongoProcess.stdout.on('data', events.onMongoData);
  mongoProcess.stderr.on('data', events.onMongoError);
  mongoProcess.on('close', events.onMongoClose);
  return _process;
}

module.exports = mongoProcess = attachProcessListeners(mongoProcess)



