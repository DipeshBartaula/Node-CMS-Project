const express = require("express");
const { blogs } = require("./model/index");
const {
  renderCreateBlog,
  createBlog,
  allBlog,
  singleBlog,
  deleteBlog,
  editBlog,
  renderEditBlog,
} = require("./controller/blog/blogController");
const app = express();
require("dotenv").config(); // requiring dotenv and initiliaixing ti with default configuration
const cookieParser = require("cookie-parser");
// database connection
require("./model/index");

//telling the nodejs to set view egine to ejs
app.set("view engine", "ejs");

//nodejs lai file access garna dey
app.use(express.static("public/"));

app.use(cookieParser);

// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
const blogRoute = require("./routes/blogRoute");
const authRoute = require("./routes/authRoute");

app.use("", blogRoute); // localhost:3000 + /createBlog === localhost:3000/createBlog
// app.use("/hello", blogRoute); // localhost:3000/hello +/createBlog = locahost:3000/hello/createBlog
app.use("", authRoute);

app.listen(3000, () => {
  console.log("Nodejs project has started at 3000 port");
});

// To clear git cache
// git rm -r --cached node_modules
