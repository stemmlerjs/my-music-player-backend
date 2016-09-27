



angular.module('audioService', [])
  .factory('playerCtrl', function($http) {

    window.audioCtx = (window.AudioContext || window.webkitAudioContext ||  window.mozAudioContext || window.oAudioContext || window.msAudioContext);
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = null;
    var globalBuffer = null;

    var player = {
      initAndPlay: function(stream, onEnd) {
        if(source != null) {
          audioCtx = killAndReturnNewAudioContext()
        }

        // Create Buffer Sourse
        source = audioCtx.createBufferSource()
        audioCtx.decodeAudioData(stream, function(buffer) {
          globalBuffer = buffer;
          source.buffer = buffer;
          source.connect(audioCtx.destination)
          source.start(0)

          source.onended = onEnd;
        })
      },

      pause: function() {
        audioCtx.suspend();
      },

      resume: function() {
        audioCtx.resume()
      },
      
      stop: function() {
        audioCtx.buffer = null;
      },

      restart: function() {
        audioCtx = killAndReturnNewAudioContext()

        source = audioCtx.createBufferSource();           // creates a sound source
        source.buffer = globalBuffer;                     // tell the source which sound to play
        source.connect(audioCtx.destination);             // connect the source to the context's destination (the speakers)
        source.start(0);                                  // play the source now
                                                          // note: on older systems, may have to use deprecated noteOn(time);
      }
    }

    function killAndReturnNewAudioContext() {
      audioCtx.suspend();
      audioCtx.close();
      return new (window.AudioContext || window.webkitAudioContext)();
    }

    return player;

  })