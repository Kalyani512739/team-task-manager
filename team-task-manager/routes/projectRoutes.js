const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getProjects } = require("../controllers/projectController");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware(["Admin"]), createProject);
router.get("/", authMiddleware, getProjects);

module.exports = router;