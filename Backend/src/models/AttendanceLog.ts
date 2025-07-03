import mongoose, { Schema, Document } from "mongoose";
import { AttendanceLog } from "../types";

interface AttendanceLogDocument extends Omit<AttendanceLog, "_id">, Document {
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceLogSchema = new Schema<AttendanceLogDocument>({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: ["Punch In", "Punch Out"]
  },
  timestamp: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["in", "out"]
  }
}, {
  timestamps: true
});

export default mongoose.model<AttendanceLogDocument>("AttendanceLog", AttendanceLogSchema);