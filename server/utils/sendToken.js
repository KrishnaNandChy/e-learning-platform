const jwt = require("jsonwebtoken");

// Generate JWT token and send response
const sendToken = (user, statusCode, res, message = "Success") => {
  // Create JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    sameSite: "strict",
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user,
  });
};

module.exports = sendToken;
