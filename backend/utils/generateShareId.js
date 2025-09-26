const { v4: uuidv4 } = require('uuid');

function generateShareId() {
  // short unique token
  return uuidv4().split('-')[0];
}

module.exports = generateShareId;
