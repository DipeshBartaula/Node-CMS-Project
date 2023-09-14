const express = require("express");
const { blogs } = require("./model/index");
const app = express();

// database connection
require("./model/index");

//telling the nodejs to set view egine to ejs
app.set("view engine", "ejs");

//nodejs lai file access garna dey
app.use(express.static("public/"));

// form bata data aairaxa parse gara or handle gar vaneko ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allBlog
app.get("/", async (req, res) => {
  // table bata data nikalnu parney vo
  //blogs vanney table bata vayejati sabbai data dey vaneko
  const allBlogs = await blogs.findAll();
  // console.log(allBlogs);

  // blogs vanney key/name ma allBlogs/data pass gareko ejs file lai
  res.render("home", { blogs: allBlogs });
});

//createBlog
app.get("/createBlog", (req, res) => {
  res.render("createBlog");
});

//createBlog Post
app.post("/createBlog", async (req, res) => {
  console.log(req.body);
  // second approach
  // const {title,description,subtitle} = req.body
  // first approach
  const title = req.body.title;
  const description = req.body.description;
  const subTitle = req.body.subtitle;

  // database ma halnu paryo , database sanaga kehi operation await halnu parney hunchha
  // agadi , await halepaxi mathi async halnu parney hunchha
  await blogs.create({
    title: title,
    subTitle: subTitle,
    description: description,
  });

  res.redirect("/");
});

//single blog page
app.get("/single/:id", async (req, res) => {
  const id = req.params.id;
  //second approach
  //const {id} = req.params

  //id ko data nikalnu paryo
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  // console.log(blog);

  //second approach
  //const blog = await blogs.findByPk(id)

  res.render("singleBlog", { blog: blog });
});

//delete page
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  //id herera blog delete garnu paryo
  await blogs.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/");
});

//Edit or update the blog
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  //finding blog of choosen id
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });

  res.render("editBlog", { blog: blog });
});

app.post("/editBlog/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(req.body);
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const description = req.body.description;

  //first approach
  // await blogs.update(req.body, {
  //   where: {
  //     id: id;
  //   }
  // })

  //second approach
  await blogs.update(
    {
      title: title,
      subTitle: subTitle,
      description: description,
    },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/single/" + id);
});

app.listen(3000, () => {
  console.log("Nodejs project has started at 3000 port");
});
