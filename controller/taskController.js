import Task from '../models/Task.js';

import Staff from '../models/userModel.js'; 
// CREATE
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE BY ID

export const getTaskById = async (req, res) => {
   try {
    const staffId = req.params.id;
    const tasks = await Task.find({ staffId }); // 👈 No populate
    res.json(tasks);
  } catch (err) {
    console.error("Get task by ID error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
