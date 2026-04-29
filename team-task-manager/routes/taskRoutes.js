const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  getDashboard
} = require("../controllers/taskController");

const roleMiddleware = require("../middleware/roleMiddleware");
router.post("/", authMiddleware, roleMiddleware(["Admin"]), createTask);
router.get("/", authMiddleware, getTasks);
router.patch("/:id", authMiddleware, updateTask);
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;