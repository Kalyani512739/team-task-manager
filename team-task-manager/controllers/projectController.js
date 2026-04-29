const Project = require("../models/Project");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    res.status(201).json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).populate("members", "name email");

    res.json(projects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};