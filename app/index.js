module.exports = function(args) {
  var utils = require('./utils')
  var config = require('./config')
  var Songs = require('./models').Song
  
  args.forEach(function(arg) {
    switch(arg) {

      case "-bm":
        console.log("Perform bulk migrate")
        utils.getAllFilesInFolder(config.MEDIA_HOME, handleFiles);
        return;
      case "-D":
        console.log("DELETING ALL SONGS FROM FROM DATABASE".red)
      default:
        return;
    }
  })

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

