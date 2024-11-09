// server/routes/authRoutes.js
const prisma = require("../db/index")
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Set your JWT secret here
const JWT_EXPIRY = "1h"; // Token expiry time (1 hour in this example)

// Helper function to create JWT
const createToken = (user) => {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// 1. Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber, gender } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        gender,
        password: hashedPassword,
        bio:"",
      },
    });
    
    // Generate JWT token
    const token = createToken(newUser);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// 2. Signin Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = createToken(user);

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to signin" });
  }
});

module.exports = router;