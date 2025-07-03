import mongoose, { Schema, Document } from "mongoose";
import { Employee } from "../types";

interface EmployeeDocument extends Omit<Employee, "_id">, Document {}

const EmployeeSchema = new Schema<EmployeeDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ["Hair Styling", "Nail Care", "Skin Care", "Massage", "Reception", "Management"]
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
    default: "Active"
  }
}, {
  timestamps: true
});

export default mongoose.model<EmployeeDocument>("Employee", EmployeeSchema);