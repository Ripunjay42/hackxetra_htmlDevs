const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = await userService.createUser({ email, name });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
