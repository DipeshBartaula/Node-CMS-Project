const { blogs, users } = require("../../model/index");
const fs = require("fs"); // fs->fileSystem

exports.renderCreateBlog = (req, res) => {
  res.render("createBlog");
};

exports.createBlog = async (req, res) => {
  //check that incoming data from middleware
  // console.log(req.user, "UserId from createBlog");
  const userId = req.user.id;
  // second approach
  // const {title,description,subtitle} = req.body
  // first approach
  const title = req.body.title;
  const description = req.body.description;
  const subTitle = req.body.subtitle;
  const fileName = req.file.filename;

  if (!title || !description || !subTitle || !req.file) {
    return res.send("Please provide title, description, subTitle, file");
  }

  // database ma halnu paryo , database sanaga kehi operation await halnu parney hunchha
  // agadi , await halepaxi mathi async halnu parney hunchha
  await blogs.create({
    title: title,
    subTitle: subTitle,
    description: description,
    userId,
    image: process.env.PROJECT_URL + fileName,
  });

  res.redirect("/");
};

exports.allBlog = async (req, res) => {
  const success = req.flash("success");
  // table bata data nikalnu parney vo
  //blogs vanney table bata vayejati sabbai data dey vaneko
  const allBlogs = await blogs.findAll();
  // console.log(allBlogs);

  // blogs vanney key/name ma allBlogs/data pass gareko ejs file lai
  res.render("home", { blogs: allBlogs, success });
};

exports.singleBlog = async (req, res) => {
  const id = req.params.id;
  //second approach
  //const {id} = req.params

  //id ko data nikalnu paryo
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
    include: {
      model: users,
    },
  });
  // console.log(blog);

  //second approach
  //const blog = await blogs.findByPk(id)

  res.render("singleBlog", { blog: blog });
};

exports.deleteBlog = async (req, res) => {
  const id = req.params.id;

  //id herera blog delete garnu paryo
  await blogs.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/");
};

exports.renderEditBlog = async (req, res) => {
  const id = req.params.id;

  //finding blog of choosen id
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });

  res.render("editBlog", { blog: blog });
};

exports.editBlog = async (req, res) => {
  const id = req.params.id;
  // console.log(req.body);
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const description = req.body.description;

  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });

  let fileUrl;
  if (req.file) {
    fileUrl = process.env.PROJECT_URL + req.file.filename;
    //For deleting the unwanted image from upload folder

    const oldImagePath = oldData[0].image;
    //console.log(oldImagePath) // http://localhost:3000/1696253533738-attention.png
    const lengthOfUnwanted = "http://localhost:3000/".length;
    const fileNameInUploadsFolder = oldImagePath.slice(lengthOfUnwanted); //lengthOfUnwanted = 22

    fs.unlink("uploads/" + fileNameInUploadsFolder, (err) => {
      if (err) {
        console.log("error happened", err);
      } else {
        console.log("Delete Successfully");
      }
    });
  } else {
    fileUrl = oldData[0].image;
  }

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
      image: fileUrl,
    },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/single/" + id);
};

exports.renderMyBlogs = async (req, res) => {
  //get this users blogs
  const userId = req.user.id;
  //find blogs of this userId
  const myBlogs = await blogs.findAll({
    where: {
      userId: userId,
    },
  });
  res.render("myBlogs.ejs", { Blogs: myBlogs });
};
