const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const blog = require("./models/blogSchema");
// const blogs = require("./data/blogs");

//Instances
const PORT = 3000 || process.env.PORT;
const app = express();
dotenv.config({ path: "./config.env" });
//ejs is used to perform templating.
app.set("view engine", "ejs"); //setting view engine as ejs

//Middleware
app.use(express.urlencoded({ extended: true })); // we can also use body-parser. ==> FormData
app.use(express.json()); //used for json data
app.use(express.static(path.join(__dirname, "public"))); // we can't use __dirname in es6 module.

//Database
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jgmzleo.mongodb.net/test`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error.name));

//Routes

app.get("/", async(req, res) => {
  try{
    const blogs = await blog.find({}); // returns a array of documents.
    // console.log(blogs)
    res.render("blog", { blogs: blogs });

  }catch(error)
  {
    res.status(400);
  }
});

app.get("/blogs/:slug", async (req, res) => {
  //   let filteredBlog = blogs.filter((e) => {
  //     return e.slug === req.params.slug;
  //   });
  const slug = req.params.slug;

  try {
    const ReqBlog = await blog.findOne({ slug: slug });
    if (ReqBlog) {
      // return res.status(200); this is for testing
      return res.render("blogPage", { ReqBlog: ReqBlog }); // return is used to setHeaders.
    }
  } catch (error) {
    return res.status(400).json({ error: error.name });
  }
  // res.render("blogPage", { filteredBlog: filteredBlog[0] });
});

app.get("/post-blog", (req, res)=>{
  res.render("blogPost")
});

app.post("/postblogs", async (req, res) => {
  const { title, content, author } = req.body;
  let slug = title.split(" ");
  // console.log(title)
  slug = slug.join("-");
  //   console.log(typeof slug, slug)
  if (!title || !content || !author) {
    res.status(400).json({ error: "Fill feilds properly" });
  }
  try {
    const newBlog = new blog({ title, content, slug, author });
    const response = await newBlog.save();
    if (response) {
      // res.status(201).json({ message: "Created a Blog" });
      res.status(201).redirect("/");
    }
  } catch (error) {
    res.status(404).json({ error: error.name });
  }
});

//listener
app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}`));
