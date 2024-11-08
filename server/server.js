const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    process.exit(1); // Exit the process with failure if DB connection fails
  }
}

startServer();
