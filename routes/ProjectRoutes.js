import express from "express";
import { createProject } from "../controllers/ProjectController.js";

const router = express.Router();

// Route to create a new project
router.post("/create", createProject);

export default router;
