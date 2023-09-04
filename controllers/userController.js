const express = require("express");
require("express-async-errors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };
  const secret = process.env.secret;
  const options = { expiresIn: "1w" };
  return jwt.sign(payload, secret, options);
}

exports.login_get = async (req, res) => {
  res.render("login");
};

exports.validate_login = [
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("Invalid Email or Password"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Invalid Email or Password"),
];

exports.login_post = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    console.log("did not pass validation");
    res.render("login", { errors: errors.errors });
    return;
  }

  //see if anyone exists in DB with that username
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    console.log("email is not valid");
    res.redirect("signup", { errors: "incorrect login or password" });
    return;
  }

  console.log("username is valid");

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  //if they do, see if password is correct
  if (!isPasswordValid) {
    console.log("password is not valid");
    res.redirect("signup", { errors: "incorrect login or password" });
    return;
  }

  console.log("password is valid");

  //if it is, send JWT
  const token = generateToken(user);

  res.cookie("jwt", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  console.log("cookie is sent");

  res.redirect("/");
};

exports.signup_get = async (req, res) => {
  res.render("signup");
};

exports.validate_signup = [
  body("email")
    .trim()
    .isLength({ min: 3 })
    .isEmail()
    .withMessage("email is invalid")
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("username must be 3 characters or longer")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("username must be 3 characters or longer")
    .escape(),
];

exports.signup_post = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    res.render("signup", { errors: errors.errors });
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  const token = generateToken(user);

  res.cookie("jwt", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.redirect("/");
};
