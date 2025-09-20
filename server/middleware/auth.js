import jwt from "jsonwebtoken"
import User from "../models/User.js";

// middleware to protect routes

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.json({ success: false, message: "User Not Found " })

    req.user = user;
    next();

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })

    // if (error.name === "TokenExpiredError") {
    //   return res.status(401).json({ success: false, message: "Token expired" });
    // }
    // if (error.name === "JsonWebTokenError") {
    //   return res.status(401).json({ success: false, message: "Invalid token" });
    // }
    // res.status(500).json({ success: false, message: "Server error" });
  }
}