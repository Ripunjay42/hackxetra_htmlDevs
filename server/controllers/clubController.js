const prisma =  require("../db/index")

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createClub = async (req, res) => {
  // Extract data from the request body
  const { name, description, coverImage } = req.body;

  try {
    // Create a new club record in the database
    const club = await prisma.club.create({
      data: {
        name,
        description,
        coverImage,
      },
    });

    // Respond with the newly created club data
    res.status(201).json({ message: 'Club created successfully', club });
  } catch (error) {
    console.error('Error creating club:', error);

    // Check if the error is due to unique constraint on the club name
    if (error.code === 'P2002') { // Prisma error code for unique constraint violation
      res.status(409).json({ error: 'Club name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create club' });
    }
  }
};

module.exports = { createClub };
