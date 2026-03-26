import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import { config } from 'dotenv';
config();

// Register function
export const register = async (userObj) => {
    try {
        // Extract only the fields allowed by the schema to prevent "strict: throw" errors
        const { firstName, lastName, email, password, role, profileImageUrl } = userObj;
        
        const filteredUserObj = { firstName, lastName, email, password, role, profileImageUrl };

        const userDoc = new UserTypeModel(filteredUserObj);
        
        // Manual validation
        await userDoc.validate();
        
        // Hash password using bcryptjs
        const salt = bcrypt.genSaltSync(10);
        userDoc.password = bcrypt.hashSync(userDoc.password, salt);
        
        // Save
        const created = await userDoc.save();
        
        const newUserObj = created.toObject();
        delete newUserObj.password;
        
        return newUserObj;
    } catch (err) {
        console.error("AuthService Register Error:", err);
        throw err;
    }
};

// Authenticate function
export const authenticate = async ({ email, password }) => {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

        // Check if it's the constant admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                { userId: "admin-id", role: "ADMIN", email: ADMIN_EMAIL },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return {
                token,
                user: {
                    _id: "admin-id",
                    firstName: "System",
                    lastName: "Admin",
                    email: ADMIN_EMAIL,
                    role: "ADMIN",
                    isActive: true
                }
            };
        }

        const user = await UserTypeModel.findOne({ email });
        if (!user) {
            const err = new Error("Invalid email");
            err.status = 401;
            throw err;
        }

        if (user.isActive === false) {
            const err = new Error("Your account is blocked. Please contact admin.");
            err.status = 403;
            throw err;
        }

        // Compare using bcryptjs
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            const err = new Error("Invalid password");
            err.status = 401;
            throw err;
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return { token, user: userObj };
    } catch (err) {
        console.error("AuthService Authenticate Error:", err);
        throw err;
    }
};
