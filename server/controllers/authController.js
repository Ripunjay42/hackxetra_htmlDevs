// server/controllers/authController.js
const prisma =  require("../db/index")

exports.registerUser = async (req, res) => {
  const {
    email,
    username,
    firstName,
    lastName,
    phoneNumber,
    gender,
    bio,
    profilePicURL
  } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        phoneNumber,
        gender,
        bio,
        profilePicURL,
        emailVerified: false,
        isEmailVerified: false
      },
    });

    // Set the cookie with `userId`
    res.cookie('userId', user.id);
    res.status(201).json({ message: 'User registered', userId: user.id });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// Check if the user exists and return user ID if true
exports.checkUserExists = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.status(200).json({ exists: true, userId: user.id });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check user existence' });
  }
};
