
  const config = require('config-yml');
  const mongoDBProcess = require('./mongo')

  module.exports = {

    MEDIA_HOME: config.media_home,

    onReady: function(initApplication) {

      return mongoDBProcess
      .init
      .then(initApplication)

    }
  }

