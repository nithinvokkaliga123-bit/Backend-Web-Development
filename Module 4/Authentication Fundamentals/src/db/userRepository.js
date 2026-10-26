const { Prisma } = require('@prisma/client');
const prisma = require('./prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createUser({ name, email, passwordHash }) {
  try {
    return await prisma.user.create({
      data: { name, email, passwordHash },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return null;
    }
    throw error;
  }
}

module.exports = { createUser, findByEmail };
