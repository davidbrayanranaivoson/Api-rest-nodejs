const express = require("express");
const expressValidator = require("express-validator");
const {
  register,
  login,
  getUserProfile,
} = require("../controllers/user.controller");
const router = express.Router();

router.post(
  "/register",
  [
    expressValidator.body("username").isLength({ min: 3, max: 20 }),
    expressValidator.body("email").isEmail(),
    expressValidator.body("password").isLength({ min: 8, max: 16 }),
    expressValidator.body().custom((value) => {
      const size = Buffer.byteLength(JSON.stringify(value), "utf-8");
      if (size > 1024 * 1024) {
        // Limit to 1 MB
        throw new Error("Request body too large");
      }
      return true;
    }),
  ],
  register,
);
router.post("/login", login);
router.get("/login/profil", getUserProfile);

module.exports = router;
