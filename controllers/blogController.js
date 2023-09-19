const express = require("express");
require("express-async-errors");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const Blog = require("../models/blogs");
const Comment = require("../models/comments");

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

  const new_comment = new Comment({});

  await new_comment.save();

  const new_blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.content,
    status: req.body.status,
    author: res.locals.user.id,
  });

  await new_blog.save();

  res.redirect("/");
};

exports.get_blog_detail = async (req, res) => {
  const blogId = req.params.id;

  const blogDetail = await Blog.findOne({ _id: blogId })
    .populate("author")
    .populate("comments");

  console.log(blogDetail);

  res.render("blog-detail", { blogDetail });
};

exports.post_blog_comment = async (req, res) => {
  const newComment = new Comment({
    message: req.body.comment,
    blog: req.params.id,
  });

  const savedComment = await newComment.save();

  await Blog.findByIdAndUpdate(req.params.id, {
    $push: { comments: savedComment._id },
  });

  res.redirect("/blog/" + req.params.id);
};

exports.get_blog_drafts = async (req, res) => {
  const blogs = await Blog.find({ status: "draft" })
    .populate("author")
    .sort({ datePosted: 1 });

  res.render("index", { blogs: blogs });
};
