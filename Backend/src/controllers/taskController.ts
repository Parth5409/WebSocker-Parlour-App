import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";

export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks"
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate) {
      res.status(400).json({
        success: false,
        message: "Title, description, assignedTo, and dueDate are required"
      });
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      res.status(400).json({
        success: false,
        message: "Due date must be in YYYY-MM-DD format"
      });
      return;
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      priority: priority || "Medium",
      status: status || "Pending",
      dueDate
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    // Validate date format if provided
    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        res.status(400).json({
          success: false,
          message: "Due date must be in YYYY-MM-DD format"
        });
        return;
      }
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, assignedTo, priority, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found"
      });
      return;
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found"
      });
      return;
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};