import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import RefreshToken from '../module/auth/refreshToken.model.js';

/**
 * Generate access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      sub: user.id, 
      role: user.role,
      username: user.username 
    },
    config.JWT_ACCESS_TOKEN_SECRET_PRIVATE,
    { 
      algorithm: 'RS256',
      expiresIn: `${config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES}m`
    }
  );
};

/**
 * Generate refresh token (long-lived) and save to database
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Refresh token object with token string
 */
export const generateRefreshToken = async (userId) => {
  // Generate random token
  const token = crypto.randomBytes(64).toString('hex');
  
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.REFRESH_TOKEN_EXPIRATION_DAYS);
  
  // Save to database
  const refreshToken = await RefreshToken.create({
    token,
    userId,
    expiresAt
  });
  
  return {
    token: refreshToken.token,
    expiresAt: refreshToken.expiresAt
  };
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET_PUBLIC, {
      algorithms: ['RS256']
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify refresh token from database
 * @param {string} token - Refresh token string
 * @returns {Promise<Object>} RefreshToken object with user
 */
export const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ 
    where: { token },
    include: ['user']
  });
  
  if (!refreshToken) {
    throw new Error('Invalid refresh token');
  }
  
  if (refreshToken.isRevoked) {
    throw new Error('Refresh token has been revoked');
  }
  
  if (new Date() > refreshToken.expiresAt) {
    throw new Error('Refresh token has expired');
  }
  
  return refreshToken;
};

/**
 * Revoke a refresh token
 * @param {string} token - Refresh token to revoke
 * @returns {Promise<boolean>} Success status
 */
export const revokeRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ where: { token } });
  
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }
  
  refreshToken.isRevoked = true;
  await refreshToken.save();
  
  return true;
};

/**
 * Revoke all refresh tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Number of tokens revoked
 */
export const revokeAllUserTokens = async (userId) => {
  const result = await RefreshToken.update(
    { isRevoked: true },
    { where: { userId, isRevoked: false } }
  );
  
  return result[0]; // Number of affected rows
};

/**
 * Clean up expired refresh tokens (can be run as a cron job)
 * @returns {Promise<number>} Number of tokens deleted
 */
export const cleanupExpiredTokens = async () => {
  const result = await RefreshToken.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date()
      }
    }
  });
  
  return result;
};
