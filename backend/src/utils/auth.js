import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokens = ({ userId }) => {
  const accessToken = jwt.sign({ id: userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15M",
  });
  const refreshToken = jwt.sign({ id: userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return {
    refreshToken,
    accessToken,
  };
};

export const verifyAccessToken =(token)=>{
        const decoded = jwt.verify(token,config.ACCESS_TOKEN_SECRET)
        return decoded
}
export const verifyRefreshToken =(token)=>{
        const decoded = jwt.verify(token,config.REFRESH_TOKEN_SECRET)
        return decoded
}