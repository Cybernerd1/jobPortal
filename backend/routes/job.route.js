import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").post(isAuthenticated,getAllJobs);
router.route("/getAdminJobs").post(isAuthenticated ,getAdminJobs)
router.route("/get/:id").get(isAuthenticated,getJobById);

export default router;