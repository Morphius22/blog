const express = require("express");
require("express-async-errors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const Blog = require("../models/blogs");

exports.get_index = async (req, res) => {
  const blogs = await Blog.find().sort({ datePosted: 1 }).populate("author");

  res.render("index", { blogs: blogs });
};

exports.get_create_blog = async (req, res) => {
  res.render("create-post");
};

exports.validate_new_blog = [
  body("title")
    .trim()
    .isEmail()
    .escape()
    .withMessage("Invalid Email or Password"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Invalid Email or Password"),
  body("status")
    .exists()
    .withMessage("status field is required")
    .isIn(["Publish", "Draft"])
    .withMessage("Invalid selection"),
];

exports.post_create_blog = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    console.log("validation error on new blog form");
    res.render("create-post", errors);
    return;
  }

  console.log("this is the user id", res.locals.user.id);

  const new_blog = new Blog({
    title: req.body.title,
    body: req.body.content,
    status: req.body.status,
    author: res.locals.user.id,
  });

  await new_blog.save();

  res.redirect("/");
};

exports.get_blog_detail = async (req, res) => {
  const blogId = req.params.id;

  const blogDetail = await Blog.findOne({ _id: blogId }).populate("author");

  res.render("blog-detail", { blogDetail });
};
