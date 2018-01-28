
function MainController ($scope, media, playerCtrl, $timeout) {

    // ================ INSTANCE VARIABLES =================== //

    $scope.library = []
    $scope.player = {
      nowPlaying: {},
      status: 0,
      albumArt: ''
    }

    media.getAllSongs()
      .then(function(result) {
        var index = 0;
        $scope.library = result.data.songs.map(function(song) {
          if(song.title !== "null" ) {
            song.index = index;
            index++;
            return song;
          }
        })
      })

    /*
     * find 
     * 
     * Find the song with the particular index. 
     * @param {Number} 
     */

    function find (index) {
      for(var i = 0; i < $scope.library.length; i++) {
        if($scope.library[i].index == index) {
          return $scope.library[i];
        }
      }
      return false;
    }

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

      // Set album artwork
      $scope.player.nowPlaying.albumArt = baseUrl + '/song/img/' + song._id;

      // Get media stream
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
      $scope.player.nowPlaying = find(newSongIndex);
      
      media.getSongStream($scope.player.nowPlaying._id)
        .then(function(result) {
          playerCtrl.initAndPlay(result.data, onEnd)
        })
    }

    /**
      * prevSong
      * 
      * Stops the current song and proceeds to play the next song in the current
      * list.
      *   @param void
    */

    var holdPrev = false;
    var holdTimeoutPromise = null;

    var firePreviousHoldTime = function() {
      holdTimeoutPromise = $timeout(function() {
        //console.log("Now, we won't go back.")
        holdPrev = false;
      }, 2000)
    }


    $scope.prevSong = function() {

      if(holdPrev) {
        // Next btn press received before HoldPrev Timer, proceed to set previous song
        $timeout.cancel(holdTimeoutPromise)
        holdPrev = false;
        setPrevious()

      } else {
        // Fire off HoldPrev Timer
        holdPrev = true;
        firePreviousHoldTime();

        // Restart Song
        playerCtrl.restart();
      }

      function setPrevious () {
        var newSongIndex = $scope.player.nowPlaying.index - 1;
        if(newSongIndex >= 0) {
          $scope.player.nowPlaying = find(newSongIndex);

          media.getSongStream($scope.player.nowPlaying._id)
            .then(function(result) {
              playerCtrl.initAndPlay(result.data, onEnd)
            })
        }
      }
    }

    /**
      * onEnd
      * 
      * Simply calls nextSong() as a callback for when a song ends at any point.
      * @param void
    */

    function onEnd() {
      $scope.nextSong();
    }

  }

app.controller('MainController', MainController)