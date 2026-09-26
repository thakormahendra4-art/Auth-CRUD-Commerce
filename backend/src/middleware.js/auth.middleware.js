import { verifyAccessToken } from "../utils/auth.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token is not found in the request header",
    });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to access this resource",
      });
    }
    next();
  };
};

export const isCustomer = authorizeRoles("customer");
export const isSeller = authorizeRoles("seller");