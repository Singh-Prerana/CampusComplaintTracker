import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer") ? auth.split(" ")[1] : null;
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decided = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decided.id).select("-password");
        if (!req.user) return res.status(401).json({ msg: "User not found" });
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Token invalid or expired"
        });
    }
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
            msg: "Forbidden"
        });
    }
    next();
};
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });
  next();
};

// export default { protect, requireRole };