
import exp from "express";
import { authenticate, register } from "../Services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/validateToken.js";
import { upload, uploadToCloudinary, cloudinary } from '../cloudinary/cloudinary.js'

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", upload.single("profilePic"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    let userObj = req.body;
    // Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }
    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
      profileImageUrl: cloudinaryResult?.secure_url,
    });
    res.status(201).json({ message: "author created", payload: newUserObj });
  } catch (err) {
    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err);
  }
});
//authenticate author(public)
// authorRoute.post("/authenticate", async (req, res) => {
//   //get user cred object
//   let userCred = req.body;
//   //call authenticate service
//   let { token, user } = await authenticate(userCred);
//   //save tokan as httpOnly cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false,
//   });
//   //send res
//   res.status(200).json({ message: "login success", payload: user });
// });

//Create article(protected route)
authorRoute.post("/articles",verifyToken("AUTHOR"), async (req, res) => {
  //get article from req
  let article = req.body;

  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});

//Read articles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR"), async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email");
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put("/articles",verifyToken("AUTHOR"),async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content,author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR", "ADMIN"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // AUTHOR can only modify their own articles, ADMIN can modify any
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    article,
  });
});


//cookies are attached while sending request








//http://localhost:4000/user-api/users
//http://localhost:4000/author-api/users

//app.use(checkAuthor)
