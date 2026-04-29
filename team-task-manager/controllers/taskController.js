const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET TASKS BY PROJECT
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE TASK STATUS
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      assignedTo: req.user.id
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const pending = tasks.filter(t => t.status !== "done").length;
    const overdue = tasks.filter(
      t => t.dueDate && t.dueDate < now && t.status !== "done"
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};