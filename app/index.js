module.exports = function() {
  var utils = require('./utils')
  var config = require('./config')
  var Songs = require('./models').Song

  utils.getAllFilesInFolder(config.MEDIA_HOME, handleFiles);

  function handleFiles(files) {
    Songs.collection.insert(files, function(err, docs) {
      if(err) {
        console.log("FAILURE: ", err)
      } else {
        console.log("SUCCESS:", docs)
      }
    })
  }

}

