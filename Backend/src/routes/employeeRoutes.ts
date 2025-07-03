import { Router } from "express";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController";
import { authenticate } from "../middleware/auth";
import { requireSuperAdmin, requireAdminOrSuperAdmin } from "../middleware/rbac";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", requireAdminOrSuperAdmin, getAllEmployees);
router.post("/", requireSuperAdmin, createEmployee);
router.put("/:id", requireSuperAdmin, updateEmployee);
router.delete("/:id", requireSuperAdmin, deleteEmployee);

export default router;