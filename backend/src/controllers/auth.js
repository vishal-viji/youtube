const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

/**
 * @desc    Signup user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    avatar,
    cover,
    channelDescription,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    avatar,
    cover,
    channelDescription,
  });

  // Generate JWT
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  res.status(201).json({
    success: true,
    data: token,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "The email is not yet registered",
    });
  }

  // Check password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "The password does not match",
    });
  }

  // Generate JWT
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

  res.status(200).json({
    success: true,
    data: token,
  });
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.me = asyncHandler(async (req, res) => {
  // Get user info
  const user = await User.findById(req.user.id).select(
    "firstname lastname username email avatar cover channelDescription"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Get subscriptions
  const subscriptions = await Subscription.find({
    subscriber: req.user.id,
  });

  const channelIds = subscriptions.map((sub) => sub.subscribeTo);

  // Get subscribed channels
  const channels = await User.find({
    _id: { $in: channelIds },
  }).select("avatar username");

  const responseUser = user.toObject();
  responseUser.channels = channels;

  res.status(200).json({
    success: true,
    data: responseUser,
  });
});
