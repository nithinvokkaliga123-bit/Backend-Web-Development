const bcrypt = require('bcryptjs');
const userRepository = require('../db/userRepository');

const BCRYPT_COST = Number(process.env.BCRYPT_COST || 12);

class AuthError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }
}

function validateFields(input, fields) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new AuthError(400, 'VALIDATION_ERROR', 'Request body must be an object');
  }

  for (const field of fields) {
    const value = input[field];
    if (typeof value !== 'string') {
      throw new AuthError(400, 'VALIDATION_ERROR', `${field} must be a non-empty string`);
    }

    const isEmpty = field === 'password' ? value.length === 0 : value.trim().length === 0;
    if (isEmpty) {
      throw new AuthError(400, 'VALIDATION_ERROR', `${field} must be a non-empty string`);
    }
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function register(input) {
  validateFields(input, ['name', 'email', 'password']);

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
  const user = await userRepository.createUser({
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash,
  });

  if (!user) {
    throw new AuthError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
  }

  return serializeUser(user);
}

async function login(input) {
  validateFields(input, ['email', 'password']);

  const user = await userRepository.findByEmail(normalizeEmail(input.email));
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AuthError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  return serializeUser(user);
}

module.exports = { AuthError, login, register };
