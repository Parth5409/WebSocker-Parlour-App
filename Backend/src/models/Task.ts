import mongoose, { Schema, Document } from "mongoose";
import { Task } from "../types";

interface TaskDocument extends Omit<Task, "_id">, Document {}

const TaskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  dueDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  }
}, {
  timestamps: true
});

export default mongoose.model<TaskDocument>("Task", TaskSchema);