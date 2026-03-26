import express from 'express';
export const commonRouter = express.Router();
import { authenticate } from '../Services/authService.js';
import jwt from 'jsonwebtoken';
import { UserTypeModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { ArticleModel } from '../models/ArticleModel.js';

// Get public articles
commonRouter.get('/articles', async (req, res) => {
    try {
        const articles = await ArticleModel.find({ isArticleActive: true }).populate("author", "firstName lastName");
        res.status(200).json({ message: "Public articles", payload: articles });
    } catch (err) {
        res.status(500).json({ message: "Error fetching articles", error: err.message });
    }
});

// Get single public article
commonRouter.get('/articles/:articleId', async (req, res) => {
    try {
        const article = await ArticleModel.findById(req.params.articleId).populate("author", "firstName lastName");
        res.status(200).json({ message: "Public article", payload: article });
    } catch (err) {
        res.status(500).json({ message: "Error fetching article", error: err.message });
    }
});

// Login
commonRouter.post('/login', async (req, res) => {
    try {
        let userCred = req.body;
        let { token, user } = await authenticate(userCred);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });
        res.status(200).json({ message: "Login Successful", payload: user });
    } catch (err) {
        res.status(err.status || 500).json({ message: "Login failed", error: err.message });
    }
});

// Logout
commonRouter.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.status(200).json({ message: "Logout successful" });
});

// Check Auth status
commonRouter.get('/check-auth', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch full user data (excluding password)
        const user = await UserTypeModel.findById(decodedToken.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "Authenticated", payload: user });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
});

// Change Password
commonRouter.put('/change-password', async (req, res) => {
    try {
        let { email, currentPassword, newPassword } = req.body;
        let userObj = await UserTypeModel.findOne({ email: email });
        if (!userObj) {
            return res.status(401).json({ message: "User not found" });
        }
        let isMatched = bcrypt.compareSync(currentPassword, userObj.password);
        if (!isMatched) {
            return res.status(401).json({ message: "Old Password is invalid" });
        }
        let salt = bcrypt.genSaltSync(10);
        let newHashedPassword = bcrypt.hashSync(newPassword, salt);
        await UserTypeModel.findByIdAndUpdate(userObj._id, { $set: { password: newHashedPassword } });
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error changing password", error: err.message });
    }
});
