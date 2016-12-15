angular.module('mediaService', [])
  
  .factory('media', function($http) {

    //var baseUrl = 'http://174.89.153.165:8000'

    var mediaService = {
      getAllSongs: function() {
        return $http.get(baseUrl + "/songs")
      },

      getSongStream: function(id) {
        return $http.get(baseUrl + '/stream/' + id, {
          responseType: "arraybuffer"
        })
      },

      getSongInfo: function(id) {
        return $http.get(baseUrl + '/song/' + id, {
          responseType: "arraybuffer"
        })
      },

      getAlbumArt: function(id) {
        return $http.get(baseUrl + '/song/img/' + id)
      }

    }

    return mediaService;

  })