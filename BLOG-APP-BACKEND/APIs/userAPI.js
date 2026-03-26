import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { register,authenticate } from '../Services/authService.js'
import { verifyToken } from '../middlewares/validateToken.js'
import { UserTypeModel } from '../models/UserModel.js'
import { upload, uploadToCloudinary, cloudinary } from '../cloudinary/cloudinary.js'


export const userRoute = exp.Router()


// Register USER
userRoute.post(
        "/users",
        upload.single("profilePic"),
        async (req, res, next) => {
        let cloudinaryResult;

            try {
                let userObj = req.body;

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );


// read all articles
userRoute.get('/articles/:userId',verifyToken("USER"),async(req,res)=>{
    //check he is a user or not
    // get all articles from ArticleModel
    let articles=await ArticleModel.find({isArticleActive:true}).populate("author", "firstName email")
    res.status(200).json({message:"here are all articles",payload:articles})
})

// read single article
userRoute.get('/articles/article/:articleId',verifyToken("USER"),async(req,res)=>{
  try{
    let articleId=req.params.articleId;
    let article=await ArticleModel.findById(articleId).populate("author", "firstName email");
    if(!article){
      return res.status(404).json({message:"Article not found"})
    }
    res.status(200).json({message:"Article found", payload:article})
  }catch(err){
    res.status(500).json({message:"Error finding article", error:err.message})
  }
})

// Add comment to an article
userRoute.put('/articles/:articleId/comments/users/:userId',verifyToken("USER"),async(req,res)=>{
    //get comment from body
    let {commentTxt}=req.body
    //get userId and artcileId
    let {userId,articleId}=req.params
    //check weather they both are vaild or not
    //get userObj from Db
    let userObjDb=await UserTypeModel.findById(userId)
    //get articleObj from Db
    let articleObjDb=await ArticleModel.findById(articleId)
    //check userObj is valid
    if(!userObjDb){
        return res.status(401).json({message:"user not found"})
    }
    //check articleObj is valid
    if(!articleObjDb){
        return res.status(401).json({message:"user not found"})
    }
    //if all vaild add comment by getting aryicleId and update
    let addedComment=await ArticleModel.findByIdAndUpdate(articleId,{$push:{comments:{user:userId,comment:commentTxt}}},{new:true})
    //return response
    res.status(200).json({message:"comment added successfully",payload:addedComment})
})


//add comment to an article(protected route)
userRoute.put('/articles/',verifyToken("USER", "AUTHOR"),async(req,res)=>{
    //get comment obj from req
    const {user,articleId,comment}=req.body;
    
    // Check if the user ID matches the token's user ID
    if(user.toString() !== req.user.userId.toString()){
        return res.status(403).json({message:"Forbidden. User ID mismatch."})
    }
    
    //find article by id and update
    let articleWithComment = await ArticleModel.findByIdAndUpdate(
        articleId,
        {$push:{comments:{user,comment}}},
        {new:true, runValidators:true}
    ).populate("author", "firstName lastName");
    
    if(!articleWithComment){
        return res.status(404).json({message:"Article not found"})
    }

    res.status(200).json({message:"comment added successfully", payload:articleWithComment})
})
