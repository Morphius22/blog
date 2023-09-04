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
