import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/taskController";
import { authenticate } from "../middleware/auth";
import { requireSuperAdmin, requireAdminOrSuperAdmin } from "../middleware/rbac";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", requireAdminOrSuperAdmin, getAllTasks);
router.post("/", requireSuperAdmin, createTask);
router.put("/:id", requireSuperAdmin, updateTask);
router.delete("/:id", requireSuperAdmin, deleteTask);

export default router;