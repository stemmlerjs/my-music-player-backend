
function stripNull (str) {
  var test = new String(str)
  return test.replace(/\0/g, '')
}

module.exports = {
    stripNull: stripNull
}