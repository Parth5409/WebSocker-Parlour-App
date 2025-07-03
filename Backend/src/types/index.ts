export interface User {
  id: string;
  email: string;
  role: "Super Admin" | "Admin";
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: "Super Admin" | "Admin";
}

export interface Employee {
  _id?: string;
  name: string;
  role: string;
  department: "Hair Styling" | "Nail Care" | "Skin Care" | "Massage" | "Reception" | "Management";
  status: "Active" | "Inactive";
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
}

export interface AttendanceLog {
  _id?: string;
  employeeId: string;
  employeeName: string;
  action: "Punch In" | "Punch Out";
  timestamp: string;
  status: "in" | "out";
}