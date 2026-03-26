import express from 'express';
import { UserTypeModel } from '../models/UserModel.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/validateToken.js';
import { register } from '../Services/authService.js';
import { upload, uploadToCloudinary, cloudinary } from '../cloudinary/cloudinary.js'

export const adminRoute = express.Router();

// Register ADMIN
adminRoute.post("/register", upload.single("profilePic"), async (req, res, next) => {
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
            role: "ADMIN",
            profileImageUrl: cloudinaryResult?.secure_url,
        });
        res.status(201).json({ message: "admin created", payload: newUserObj });
    } catch (err) {
        // Step 3: rollback
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

// Read all articles (Admin only)
adminRoute.get('/articles', verifyToken("ADMIN"), async (req, res, next) => {
    try {
        let articles = await ArticleModel.find().populate("author", "firstName email isActive");
        res.status(200).json({ message: "All articles", payload: articles });
    } catch (err) {
        next(err);
    }
});

// Get all users (Admin only)
adminRoute.get('/users', verifyToken("ADMIN"), async (req, res, next) => {
    try {
        const users = await UserTypeModel.find({ role: { $ne: 'ADMIN' } });
        res.status(200).json({ message: "All users", payload: users });
    } catch (err) {
        next(err);
    }
});

// Unblock User
adminRoute.patch('/unblock/:userId', verifyToken("ADMIN"), async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let unblockedUser = await UserTypeModel.findByIdAndUpdate(userId, { $set: { isActive: true } }, { new: true });
        if (!unblockedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User successfully unblocked", payload: unblockedUser });
    } catch (err) {
        next(err);
    }
});

// Block User
adminRoute.patch('/block/:userId', verifyToken("ADMIN"), async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let blockedUser = await UserTypeModel.findByIdAndUpdate(userId, { $set: { isActive: false } }, { new: true });
        if (!blockedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User successfully blocked", payload: blockedUser });
    } catch (err) {
        next(err);
    }
});
