const {
  renderCreateBlog,
  createBlog,
  allBlog,
  singleBlog,
  deleteBlog,
  editBlog,
  renderEditBlog,
} = require("../controller/blog/blogController");

const router = require("express").Router();

// kohi createBlog ma gayo vaney k garney vaneko ho hae
// app.get("/createBlog", renderCreateBlog);
// app.post("/createBlog", createBlog);
// Below code is also known as restfull api
router.route("/createBlog").get(renderCreateBlog).post(createBlog);
router.route("/").get(allBlog);
router.route("/single/:id").get(singleBlog);
router.route("/delete/:id").get(deleteBlog);
router.route("/edit/:id").post(editBlog).get(renderEditBlog);

//we can do this as well
// router.route("/:id").get(singleBlog).post(editBlog)

module.exports = router;