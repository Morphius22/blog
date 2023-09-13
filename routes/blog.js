var express = require("express");
var router = express.Router();
const blogController = require("../controllers/blogController");

/* GET home page. */
router.get("/", blogController.get_index);

router.get("/blog/create", blogController.get_create_blog);

router.post("/blog/create", blogController.post_create_blog);

router.get("/blog/:id", blogController.get_blog_detail);

module.exports = router;
