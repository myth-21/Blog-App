import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  //read token from req
  return (req, res, next) => {

    try {

      //read token
      let token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized request. Please login" });
      }

      //verify the validity of the token( decoding the token)
      let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      //check if role is allowed
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden. You don't have permission"
        });
      }

      //attach user info to req for use in routes
      req.user = decodedToken;

      //forward req to next middleware/route
      next();

    } catch (err) {
      //jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again" });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }

      next(err);
    }

  };

};