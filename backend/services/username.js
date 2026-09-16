function isValidUsername(username) {
  return !username.includes(" ");
}

module.exports = { isValidUsername };
