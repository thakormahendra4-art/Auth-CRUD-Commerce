import express from "express";
import authRoutes from "../routes/auth.routes.js";
import cookieParser from "cookie-parser"

const app = express();

// Middleware
app.use(express.json());

//cookieParser
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
