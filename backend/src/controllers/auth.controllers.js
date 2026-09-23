import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/auth.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password } = req.body;

    // 1. Check all fields
    if (!firstName || !lastName || !mobile || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      mobile,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    // 5. Send
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email received:", email);
    console.log("Password received:", password);

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log("Password matched:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }

    // Issue a fresh access/refresh pair, same as register()
    const { accessToken, refreshToken } = generateTokens({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // keep in sync with REFRESH_TOKEN_EXPIRY
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      },
      accessToken,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

