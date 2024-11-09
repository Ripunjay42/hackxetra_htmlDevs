// authMiddleware.js

const jwt = require("jsonwebtoken");
const prisma = require("./db/index")
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify JWT token and set req.user
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to req.user
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to verify if the user is an admin of a specific club
const verifyAdmin = async (req, res, next) => {
  const { clubId } = req.params;
  const userId = req.user.userId;
  console.log(clubId);
  console.log(userId);
  
  
  try {
    const isAdmin = await prisma.ClubAdmin.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    console.log(isAdmin);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied, admin only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to verify admin" });
  }
};

module.exports = { verifyUser, verifyAdmin };
