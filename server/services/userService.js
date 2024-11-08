const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

exports.getUsers = async () => {
  return await prisma.user.findMany();
};
