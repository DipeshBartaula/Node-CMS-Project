const {
  renderCreateBlog,
  createBlog,
  allBlog,
  singleBlog,
  deleteBlog,
  editBlog,
  renderEditBlog,
  renderMyBlogs,
} = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router();

const { multer, storage } = require("../middleware/multerConfig");
const { isValidUser } = require("../middleware/validUser");
const upload = multer({ storage: storage });

// kohi createBlog ma gayo vaney k garney vaneko ho hae
// app.get("/createBlog", renderCreateBlog);
// app.post("/createBlog", createBlog);
// Below code is also known as restfull api
router
  .route("/createBlog")
  .get(isAuthenticated, renderCreateBlog)
  .post(isAuthenticated, upload.single("image"), createBlog);
router.route("/").get(allBlog);
router.route("/single/:id").get(isAuthenticated, singleBlog);
router.route("/delete/:id").get(isAuthenticated, deleteBlog);
router
  .route("/edit/:id")
  .post(isAuthenticated, isValidUser, upload.single("image"), editBlog)
  .get(isAuthenticated, renderEditBlog);
router.route("/myBlogs").get(isAuthenticated, renderMyBlogs);

//we can do this as well
// router.route("/:id").get(singleBlog).post(editBlog)

module.exports = router;
