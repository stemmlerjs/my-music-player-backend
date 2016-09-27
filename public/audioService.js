



angular.module('audioService', [])
  .factory('playerCtrl', function($http) {

    window.audioCtx = (window.AudioContext || window.webkitAudioContext ||  window.mozAudioContext || window.oAudioContext || window.msAudioContext);
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = null;

    var player = {
      initAndPlay: function(stream, onEnd) {
        if(source != null) {
          audioCtx.suspend()
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Create Buffer Sourse
        source = audioCtx.createBufferSource()
        audioCtx.decodeAudioData(stream, function(buffer) {
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
      }
    }

    return player;

  })