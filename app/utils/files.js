
var walk = require('walk')
var id3 = require('id3js')

function getAllFilesInFolder (startDirectory, cb) {
  var walker  = walk.walk(startDirectory, { followLinks: false });
  var files = []

  walker.on('file', function(root, stat, next) {
      // Add this file to the list of files
      var filePath = root + '/' + stat.name;
      accumulateMusicInfo(filePath, function(info) {
        console.log(info.track + " - " + info.artist + " - " + info.album)
        info.path = filePath;
        files.push(info);
        next();
      })
  });

  walker.on('end', function() {
    cb(files)
  });
}

  /*
  * accumulateMusicInfo
  *
  * Gathers information about the music file.
  * @param path - String
  * @param next - Function
  */

function accumulateMusicInfo(path, next) {
  id3({ file: path , type: id3.OPEN_LOCAL }, function(err, tags) {
    var retObj = {
      album: tags.v2.album || tags.album,
      artist: tags.v2.artist || tags.artist,
      title: tags.v2.title || tags.title,
      composer: tags.v2.composer,
      genre: tags.v2.genre,
      recording_time: tags.v2['recording-time'],
      track: tags.v2.track,
      year: tags.v2.year || tags.year,
      image: tags.v2.image
    }

    for(var key in retObj) {
      if(key != 'image') {
        retObj[key] = stripNull(retObj[key])
      }
    }

    next(retObj)
  })
}

module.exports = {
  getAllFilesInFolder: getAllFilesInFolder
}