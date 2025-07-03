import { Server, Socket } from "socket.io";
import AttendanceLog from "../models/AttendanceLog";

export const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("attendance_update", async (data) => {

      try {
        const { employeeId, employeeName, action, timestamp, status } = data;

        if (!employeeId || !employeeName || !action || !timestamp || !status) {
          console.error("❌ Invalid attendance data received");
          socket.emit("error", { message: "Invalid attendance data" });
          return;
        }
        const attendanceLog = new AttendanceLog({
          employeeId,
          employeeName,
          action,
          timestamp,
          status
        });

        await attendanceLog.save();

        io.emit("attendance_update", {
          type: "attendance_update",
          data: {
            _id: attendanceLog._id,
            employeeId,
            employeeName,
            action,
            timestamp,
            status,
            createdAt: attendanceLog.createdAt
          }
        });
        io.to(`employee_${employeeId}`).emit("status_update", {
          status: status === "in"
        });

      } catch (error) {
        console.error("❌ Socket attendance update error:", error);
        socket.emit("error", {
          message: "Failed to process attendance update",
          error: error
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};