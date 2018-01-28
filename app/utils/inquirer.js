
var inquirer = require('inquirer');

const actions = {
  BULK_MIGRATE: 'BULK_MIGRATE',
  DELETE_ALL: 'DELETE_ALL'
}

function prompt () {
  return inquirer.prompt(
    [{
      type: 'list',
      name: 'action',
      message: 'What do you want to do next?',
      choices: Object.keys(actions).map((option) => {
        return option.toString()
      }),
      filter: function (val) {
        return val.toUpperCase();
      }
    }]
  )
}

module.exports = {
  prompt: prompt,
  actions: actions
}