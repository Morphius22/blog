var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/login", userController.login_get);

router.get("/signup", userController.signup_get);

router.post(
  "/signup",
  userController.validate_signup,
  userController.signup_post
);

router.post("/login", userController.validate_login, userController.login_post);

module.exports = router;
