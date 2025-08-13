const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all tasks for the current user
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error("Error in GET /tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// Get a single task
router.get("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

// Create a task
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, priority, category, dueDate } = req.body;
        const task = new Task({
            title,
            description,
            priority,
            category,
            dueDate,
            user: req.user._id,
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Error in POST /tasks:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

module.exports = router;
