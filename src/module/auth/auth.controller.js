import User from '../user/user.model.js';
import bcrypt from 'bcrypt';
import config from '../../config/config.js';
import * as tokenService from '../../services/token.service.js';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role, avatar, bio } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      role: role || 'player',
      avatar,
      bio
    });
    
    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = await tokenService.generateRefreshToken(user.id);
    
    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      accessToken,
      refreshToken: refreshToken.token
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = await tokenService.generateRefreshToken(user.id);
    
    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;
    
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken: refreshToken.token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

/**
 * Refresh access token using refresh token
 * @route POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    // Verify refresh token
    const tokenData = await tokenService.verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const accessToken = tokenService.generateAccessToken(tokenData.user);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token', error: error.message });
  }
};

/**
 * Logout user (revoke refresh token)
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    // Revoke refresh token
    await tokenService.revokeRefreshToken(refreshToken);
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    // User is already attached to req by passport middleware
    const userResponse = req.user.toJSON();
    delete userResponse.passwordHash;
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
