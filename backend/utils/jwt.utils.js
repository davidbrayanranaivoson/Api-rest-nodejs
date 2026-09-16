let jwt = require("jsonwebtoken");

module.exports.generateTokenForUser = (userData) => {
  return jwt.sign(
    {
      userId: userData.id,
      isAdmin: userData.isAdmin,
    },
    process.env.JWT_SIGN_SECRET,
    {
      expiresIn: "1h",
    },
  );
};
module.exports.parseAuthorization = (authorization) => {
  return authorization != null ? authorization.replace("Bearer ", "") : null;
};
module.exports.getUserId = (authorization) => {
  let userId = -1;
  let token = this.parseAuthorization(authorization);
  if (token != null) {
    try {
      let jwtToken = jwt.verify(token, process.env.JWT_SIGN_SECRET);
      if (jwtToken != null) {
        userId = jwtToken.userId;
      }
    } catch (err) {
      console.log(err, `Token invalid : ${err}`);
    }
  }
  return userId;
};
module.exports.getUPost = (authorization) => {
  let PostId = -1;
  let token = this.parseAuthorization(authorization);
  if (token != null) {
    try {
      let jwtToken = jwt.verify(token, process.env.JWT_SIGN_SECRET);
      if (jwtToken != null) {
        PostId = jwtToken.PostId;
      }
    } catch (err) {
      console.log(err, `Token invalid : ${err}`);
    }
  }
  return PostId;
};
