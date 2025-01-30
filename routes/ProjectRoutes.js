import express from "express";
import { createProject, 
         getCompetitionStats ,
         getENTCContacts ,
         getOtherContacts,
         getEntcProjects,
        getOtherProjects} from "../controllers/ProjectController.js";


const router = express.Router();

// Route to create a new project
router.post("/create", createProject);
router.get("/competition-stats", getCompetitionStats);
router.get("/entc-contacts", getENTCContacts);
router.get("/other-contacts", getOtherContacts);
router.get("/entc-projects", getEntcProjects);
router.get("/other-projects", getOtherProjects);
export default router;
