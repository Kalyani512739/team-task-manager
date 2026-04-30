const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    msg: "You accessed protected route",
    user: req.user
  });
});

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
