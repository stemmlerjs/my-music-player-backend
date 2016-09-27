
module.exports = function(app) {
  var fs = require('fs')
  var path = require('path')
  var Songs = require('../models').Song
  var id3 = require('id3js')

  /* Serve the index.html page
  */
  app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'))
  })

  app.get('/stream', function(req, res) {
      var stream = fs.createReadStream(__dirname + '/6_GoldBlade.mp3');
      stream.pipe(res);
  })

  app.get('/songs', function(req, res) {
    Songs.find({}, function(err, songs) {
      res.json({
        songs: songs
      })
    })
  })

  app.get('/song/img/:id', function(req, res) {
    var id = req.params.id;
    Songs.findById(id, function(err, doc) {
      if(err) {
        res.json({
          success: false,
          error: 'Could not find a song with that id'
        })
      } else {
        // Get image
        id3({ file: doc.path , type: id3.OPEN_LOCAL }, function(err, tags) {
          if(tags.v2.image) {
            res.contentType(tags.v2.image.mime);
            var bufferedImage = toBuffer(tags.v2.image.data)
            res.end(bufferedImage, 'binary');
          } else {
            res.json({
              success: false,
              error: 'No album art'
            })
          }
        })
      }
    })
  })

  app.get('/stream/:id', function(req, res) {
    var id = req.params.id
    Songs.findById(id, function(err, doc) {
      if(err) {
        res.json({
          success: false,
          error: 'Could not find a song with that id'
        })
      } else {
        // Get the file 
        var stream = fs.createReadStream(path.normalize(doc.path));
        stream.pipe(res);
      }
    })
  })
}

    /**
      * toBuffer
      * 
      * Converts an ArrayBuffer to a Buffer
      *   @param ArrayBuffer - ab
      *   @return Buffer
    */

function toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
  }

// GET ALL SONGS
// DELETE SONG
// LOGIN
// LOGOUT
// UPLOAD SONG(S)
// GET SONG (STREAM)