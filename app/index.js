
/**
 * This is the command line interface to perform common actions that need to happen
 * for the maintainence and development like "Adding all files to the Database" or 
 * "Deleting all files from the database". 
 *
 * MongoDB is started through a child process and we should be able to monitor the output
 * of each of the commands that we run.
 *  
 * @summary   The main command line interface application.
 * @requires [inquirer]
 */

  var utils = require('./utils')
  var config = require('./config')      
  var Songs = require('./models').Song

  class App {

    constructor(songs) {
      this.started = false;
      this.actions = utils.inquirer.actions;
    }

   /**
    * insertFiles()
    *
    * Insert all the files acquired from walking the tree at the MEDIA_HOME folder
    * 
    * @params files [] - array of files to insert
    */

    handleFiles(files) {
      Songs.collection.insert(files, function(err, docs) {
        if(err) {
          console.log("FAILURE: ", err)
        } else {
          console.log("SUCCESS:", docs)
        }
      })
    }

    prompt () {
      return utils.inquirer.prompt();
    }

    perform (option) {
      return new Promise((resolve, reject) => {
        switch(option.action) {
          case this.actions.BULK_MIGRATE:
            console.log("Performing bulk migrate. Grabbing all files from folder '" + config.MEDIA_HOME + "' to place in DB.")
            utils.files.getAllFilesInFolder(config.MEDIA_HOME, this.handleFiles);
            return;
          case this.actions.DELETE_ALL:
            console.log("Deleting all files from Database.")
            Songs.remove({}, function() {
              console.log("Done.")
              resolve();
            })
            return;
          default:
            return;
        }
      })
    }

    async run () {
      while(true) {
        debugger;
        var option = await this.prompt();
        var isFinished = await this.perform(option);
      }
    }
  }


  const appInstance = new App();
  config.onReady(appInstance.run.bind(appInstance))




