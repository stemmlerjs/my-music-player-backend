
app = angular.module('khalilsMediaPlayer', ['mediaService', 'audioService'])
  .controller('MainController', function($scope, media, playerCtrl) {

    // ================ INSTANCE VARIABLES =================== //

    $scope.library = []
    $scope.player = {
      nowPlaying: {},
      status: 0
    }

    media.getAllSongs()
      .then(function(result) {
        var index = 0;
        $scope.library = result.data.songs.map(function(song) {
          song.index = index;
          index++;
          return song;
        })
      })

    // ================ Methods =================== //

    /**
      * selectSong
      * 
      * On the click of a song, it will start to play.
      * This will get the stream from the backend and stop and other song playing 
      * and start the selected song up.
      *  
      *   @param (Obj) - song 
    */

    $scope.selectSong = function(song) {
      $scope.player.nowPlaying = song

      media.getAlbumArt(song._id)
        .then(function(result) {
          console.log(result)
          // var imageType = result.headers('Content-Type')

          // var arrayBuffer = toArrayBuffer(result.data);
          // var bytes = new Uint8Array(arrayBuffer);

          // var blob = new Blob([bytes], {type: imageType});
          // var urlCreator = window.URL || window.webkitURL;
          // var imageUrl = urlCreator.createObjectURL(blob);

          // var image = document.getElementById('npImg');
          // image.src = imageUrl;

        })

      media.getSongStream(song._id)
        .then(function(result) {
          playerCtrl.initAndPlay(result.data, onEnd)
          $scope.player.status = 1;
        })
    }

    /**
      * playPause
      * 
      * Plays or pauses the current song.
      *   @param void
    */

    $scope.playPause = function() {
      if ($scope.player.status == 0) {
        playerCtrl.resume();
        $scope.player.status = 1;
      } else {
        playerCtrl.pause();
        $scope.player.status = 0;
      }
    }

    /**
      * nextSong
      * 
      * Stops the current song and proceeds to play the next song in the current
      * list.
      *   @param void
    */


    $scope.nextSong = function() {
      var newSongIndex = $scope.player.nowPlaying.index + 1;
      $scope.player.nowPlaying = findNext(newSongIndex);
      
      media.getSongStream($scope.player.nowPlaying._id)
        .then(function(result) {
          playerCtrl.initAndPlay(result.data, onEnd)
        })

      function findNext (index) {
        for(var i = 0; i < $scope.library.length; i++) {
          if($scope.library[i].index == index) {
            return $scope.library[i];
          }
        }
        return false;
      }
    }

  function onEnd() {
    $scope.nextSong();
  }

  })
