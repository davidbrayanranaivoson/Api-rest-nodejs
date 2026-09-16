const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const userModel = require("../models/user.model");
const passwordcheck = require("../services/password");
const { isValidEmail } = require("../services/email");
const { isValidUsername } = require("../services/username");
const expressSanitizer = require("express-mongo-sanitize");

module.exports.register = async (req, res) => {
  const email = expressSanitizer.sanitize(req.body.email);
  const username = expressSanitizer.sanitize(req.body.username);
  const password = expressSanitizer.sanitize(req.body.password);
  const passwordverify = passwordcheck.checkPasswordStrength(password);
  const bio = req.body.bio;
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Merci de remplire toutes les parametres" });
  } else if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide" });
  } else if (!isValidUsername(username)) {
    return res
      .status(400)
      .json({ error: "Le username ne doit pas contenir d'espace" });
  } else if (passwordverify) {
    return res.status(400).json({
      error: passwordverify,
    });
  }

  //verify pseudo length, mail regex, passwors etc.
  userModel
    .findOne({ email: email })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 5, (err, bcryptedPassword) => {
          let newUser = userModel
            .create({
              email: email,
              username: username,
              password: bcryptedPassword,
              bio: bio,
              isAdmin: 0,
            })
            .then((newUser) =>
              res.status(201).json({
                userId: newUser._id,
                token: jwtUtils.generateTokenForUser(newUser),
              }),
            )
            .catch((err) =>
              res.status(500).json({ error: `Cannot add user : ${err}` }),
            );
        });
      } else {
        return res.status(409).json({ error: "User already exist" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: `Unable to verify user : ${err}` });
    });
};
module.exports.login = async (req, res) => {
  const email = expressSanitizer.sanitize(req.body.email);
  const password = expressSanitizer.sanitize(req.body.password);

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Merci de remplire toutes les parametres" });
  }
  //verify mail & password

  userModel.findOne({ email: email }).then((userFound) => {
    if (userFound) {
      bcrypt.compare(password, userFound.password, (err, resBycrypt) => {
        if (resBycrypt) {
          return res.status(200).json({
            userId: userFound.id,
            token: jwtUtils.generateTokenForUser(userFound),
          });
        } else {
          return res.status(409).json({ error: "Invalid password or email " });
        }
      });
    } else {
      return res.status(409).json({ error: "User not found" });
    }
  });
};
module.exports.getUserProfile = async (req, res) => {
  let headerAuth = req.headers["authorization"];
  let userId = jwtUtils.getUserId(headerAuth);

  if (userId < 0) {
    return res.status(400).json({ error: "wrong token" });
  }
  try {
    const user = await userModel.findOne(
      { _id: userId },
      { email: 1, username: 1, bio: 1 },
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Retournez les informations sans le mot de passe
    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
