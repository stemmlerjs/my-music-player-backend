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

  var inquirer = require('inquirer');
  var utils = require('./utils')

  // We initialize MongoDB through this require
  var config = require('./config')

  var Songs = require('./models').Song
  var appActionChoices = ['Start as usual', 'Bulk Migrate', 'Delete All Files'];

 /**
  * We start the main cli application 2 seconds later to give time for MongoDB's setup output to display first.
  */

  setTimeout(mainAppConsole, 2000)

 /**
  * mainAppConsole()
  *
  * The Main CLI Application.
  * Through this, we should be able to perform the majority of the maintainence tasks to start the app, add an remove things.
  * 
  * @params choiceCut - We may wish to only show specific choices. TODO: implement differently.
  *
  */

  function mainAppConsole(choiceCut) { 
    if (choiceCut == undefined) choiceCut = 0

   /**
    * Prompt the user for which action to perform.
    */

    inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: appActionChoices.slice(0, appActionChoices.length - choiceCut),
      filter: function (val) {
        return val.toLowerCase();
      }
    }])
    .then(function (option) {

    /**
      * Prompt the user for which action to perform.
      */

        switch(option.action) {
          case "start as usual":
            console.log("kk :)")
            return;
          case "bulk migrate":
            console.log("Performing bulk migrate. Grabbing all files from folder '" + config.MEDIA_HOME + "' to place in DB.")
            utils.getAllFilesInFolder(config.MEDIA_HOME, handleFiles);
            return;
          case "delete all files":
            console.log("Deleting all files from Database.")
            Songs.remove({}, function() {
              console.log("Done.")
              mainAppConsole(1);
            })
            return;
          default:
            return;
        }
    });
  }

 /**
  * insertFiles()
  *
  * Insert all the files acquired from walking the tree at the MEDIA_HOME folder
  * 
  * @params files [] - array of files to insert
  */

  function handleFiles(files) {
    Songs.collection.insert(files, function(err, docs) {
      if(err) {
        console.log("FAILURE: ", err)
      } else {
        console.log("SUCCESS:", docs)
      }
    })
  }




