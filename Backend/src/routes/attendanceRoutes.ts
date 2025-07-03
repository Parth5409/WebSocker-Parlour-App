import { Router } from "express";
import { getAttendanceLogs, createAttendanceLog } from "../controllers/attendanceController";
import { authenticate } from "../middleware/auth";
import { requireAdminOrSuperAdmin } from "../middleware/rbac";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/logs", requireAdminOrSuperAdmin, getAttendanceLogs);
router.post("/log", requireAdminOrSuperAdmin, createAttendanceLog);

export default router;